const { oleoduc, writeData, filterData, mergeStreams } = require("oleoduc");
const { uniq, isEmpty } = require("lodash");
const { flattenObject, isError } = require("../common/utils/objectUtils");
const { validateUAI } = require("../common/utils/uaiUtils");
const logger = require("../common/logger");
const { dbCollection } = require("../common/db/mongodb");

function buildQuery(selector) {
  if (isEmpty(selector)) {
    return { not: "matching" };
  }

  return typeof selector === "object" ? selector : { $or: [{ siret: selector }, { uai: selector }] };
}

function mergeArray(from, existingArray, discriminator, newArray, custom = () => ({})) {
  let updated = newArray.reduce((acc, item) => {
    let found = existingArray.find((c) => c[discriminator] === item[discriminator]) || {};
    acc.push({
      ...found,
      ...item,
      sources: uniq([...(found.sources || []), from]),
      ...custom(found, item),
    });
    return acc;
  }, []);

  let untouched = existingArray.filter((p) => {
    return !updated.map((u) => u[discriminator]).includes(p[discriminator]);
  });

  return [...updated, ...untouched];
}

function mergeUAI(from, etablissement, uais) {
  return mergeArray(
    from,
    etablissement.uais,
    "uai",
    uais.filter((uai) => uai && uai !== "NULL").map((uai) => ({ uai })),
    (found, data) => {
      return {
        valide: validateUAI(data.uai),
      };
    }
  );
}

async function mergeRelations(from, etablissement, relations) {
  let res = mergeArray(from, etablissement.relations, "siret", relations);

  return Promise.all(
    res.map(async (r) => {
      let count = await dbCollection("etablissements").countDocuments({ siret: r.siret });
      return {
        ...r,
        referentiel: count > 0,
      };
    })
  );
}

async function mergeContacts(from, etablissement, contacts) {
  return mergeArray(from, etablissement.contacts, "email", contacts, (found, contact) => {
    return {
      confirmé: contact.confirmé || false,
      ...(contact._extras ? { _extras: { ...(found._extras || {}), [from]: contact._extras } } : {}),
    };
  });
}

function handleAnomalies(from, etablissement, anomalies) {
  logger.warn(
    { anomalies },
    `[Collect][${from}] Erreur lors de la collecte pour l'établissement ${etablissement.siret}.`
  );

  return dbCollection("etablissements").updateOne(
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

async function getStreams(sources) {
  return Promise.all(sources.map((source) => source.stream()));
}

module.exports = async (array, options = {}) => {
  let sources = Array.isArray(array) ? array : [array];
  let filters = options.filters || {};
  let stats = createStats(sources);
  let streams = await getStreams(sources);

  await oleoduc(
    mergeStreams(streams),
    filterData((data) => {
      return filters.siret ? filters.siret === data.selector : !!data;
    }),
    writeData(async (res) => {
      let { from, selector, uais = [], contacts = [], relations = [], reseaux = [], data = {}, anomalies = [] } = res;
      stats[from].total++;
      let query = buildQuery(selector);
      let etablissement = await dbCollection("etablissements").findOne(query);
      if (!etablissement) {
        stats[from].ignored++;
        return;
      }

      try {
        if (anomalies.length > 0) {
          stats[from].failed++;
          await handleAnomalies(from, etablissement, anomalies);
        }

        let res = await dbCollection("etablissements").updateOne(
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
          logger.info(`[Collect][${from}] Etablissement ${etablissement.siret} updated`);
        }
      } catch (e) {
        stats[from].failed++;
        await handleAnomalies(from, etablissement, [e]);
      }
    })
  );

  return stats;
};
