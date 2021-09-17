const { oleoduc, writeData, filterData, mergeStreams } = require("oleoduc");
const { uniq, isEmpty } = require("lodash");
const { flattenObject, isError } = require("../../common/utils/objectUtils");
const { validateUAI } = require("../../common/utils/uaiUtils");
const logger = require("../../common/logger");
const { dbCollection } = require("../../common/db/mongodb");

function buildQuery(selector) {
  if (isEmpty(selector)) {
    return { not: "matching" };
  }

  return typeof selector === "object" ? selector : { $or: [{ siret: selector }, { uai: selector }] };
}

function mergeUAI(from, etablissement, uais) {
  let updated = uais
    .filter((uai) => uai && uai !== "NULL")
    .reduce((acc, uai) => {
      let found = etablissement.uais.find((u) => u.uai === uai) || {};
      let sources = uniq([...(found.sources || []), from]);
      acc.push({ ...found, uai, sources, valide: validateUAI(uai) });
      return acc;
    }, []);

  let previous = etablissement.uais.filter((us) => !updated.map(({ uai }) => uai).includes(us.uai));

  return [...updated, ...previous];
}

async function mergeRelations(from, etablissement, relations) {
  let updated = relations.reduce((acc, relation) => {
    let found = etablissement.relations.find((r) => r.siret === relation.siret) || {};
    let sources = uniq([...(found.sources || []), from]);
    acc.push({ ...found, ...relation, sources });
    return acc;
  }, []);

  let previous = etablissement.relations.filter((r) => !updated.map(({ siret }) => siret).includes(r.siret));

  return Promise.all(
    [...updated, ...previous].map(async (r) => {
      let count = await dbCollection("annuaire").countDocuments({ siret: r.siret });
      return {
        ...r,
        annuaire: count > 0,
      };
    })
  );
}

async function mergeContacts(from, etablissement, contacts) {
  let updated = contacts.reduce((acc, contact) => {
    let found = etablissement.contacts.find((c) => c.email === contact.email) || {};
    acc.push({
      ...found,
      ...contact,
      confirmé: contact.confirmé || false,
      sources: uniq([...(found.sources || []), from]),
      ...(contact._extras ? { _extras: { ...(found._extras || {}), [from]: contact._extras } } : {}),
    });
    return acc;
  }, []);

  let previous = etablissement.contacts.filter((r) => !updated.map(({ email }) => email).includes(r.email));

  return [...updated, ...previous];
}

function handleAnomalies(from, etablissement, anomalies) {
  logger.warn(
    { anomalies },
    `[Collect][${from}] Erreur lors de la collecte pour l'établissement ${etablissement.siret}.`
  );

  return dbCollection("annuaire").updateOne(
    { siret: etablissement.siret },
    {
      $push: {
        "_meta.anomalies": {
          $each: anomalies.map((ano) => {
            return {
              job: "collect",
              source: from,
              date: new Date(),
              code: isError(ano) ? "erreur" : ano.code,
              details: ano.message,
            };
          }),
          // Max 10 elements ordered by date
          $slice: 10,
          $sort: { date: -1 },
        },
      },
    },
    { runValidators: true }
  );
}

function createStats(sources) {
  return sources.reduce((acc, source) => {
    return {
      ...acc,
      [source.name]: {
        total: 0,
        updated: 0,
        ignored: 0,
        failed: 0,
      },
    };
  }, {});
}

module.exports = async (array, options = {}) => {
  let sources = Array.isArray(array) ? array : [array];
  let filters = options.filters || {};
  let stats = createStats(sources);

  let streams = await Promise.all(sources.map((source) => source.stream({ filters })));

  await oleoduc(
    mergeStreams(streams),
    filterData((data) => {
      return filters.siret ? filters.siret === data.selector : !!data;
    }),
    writeData(async (res) => {
      let { from, selector, uais = [], contacts = [], relations = [], reseaux = [], data = {}, anomalies = [] } = res;
      stats[from].total++;
      let query = buildQuery(selector);
      let etablissement = await dbCollection("annuaire").findOne(query);
      if (!etablissement) {
        stats[from].ignored++;
        return;
      }

      try {
        if (anomalies.length > 0) {
          stats[from].failed++;
          await handleAnomalies(from, etablissement, anomalies);
        }

        let res = await dbCollection("annuaire").updateOne(
          query,
          {
            $set: {
              ...flattenObject(data),
              uais: mergeUAI(from, etablissement, uais),
              relations: await mergeRelations(from, etablissement, relations),
              contacts: await mergeContacts(from, etablissement, contacts),
            },
            $addToSet: {
              reseaux: {
                $each: reseaux,
              },
            },
          },
          { runValidators: true }
        );

        let nbModifiedDocuments = res.modifiedCount;
        if (nbModifiedDocuments) {
          stats[from].updated += nbModifiedDocuments;
          logger.info(`[Annuaire][Collect][${from}] Etablissement ${etablissement.siret} updated`);
        }
      } catch (e) {
        stats[from].failed++;
        await handleAnomalies(from, etablissement, [e]);
      }
    })
  );

  return stats;
};
