const { oleoduc, writeData, filterData, mergeStreams } = require("oleoduc");
const { uniq, isEmpty } = require("lodash");
const { flattenObject, isError } = require("../common/utils/objectUtils");
const { validateUAI } = require("../common/utils/uaiUtils");
const logger = require("../common/logger");
const { dbCollection } = require("../common/db/mongodb");
const { sortBy } = require("lodash/collection");

function buildQuery(selector) {
  if (isEmpty(selector)) {
    return { not: "matching" };
  }

  return typeof selector === "object" ? selector : { $or: [{ siret: selector }, { uai: selector }] };
}

function mergeArray(from, existingArray, discriminator, newArray, custom = () => ({})) {
  let updated = newArray.map((item) => {
    let found = existingArray.find((e) => e[discriminator] === item[discriminator]) || {};
    return {
      ...found,
      ...item,
      sources: uniq([...(found.sources || []), from]),
      ...custom(found, item),
    };
  });

  let untouched = existingArray.filter((p) => {
    return !updated.map((u) => u[discriminator]).includes(p[discriminator]);
  });

  return sortBy([...updated, ...untouched], discriminator);
}

function mergeUAI(from, uais, newUAIs) {
  let newArray = newUAIs.filter((uai) => uai && uai !== "NULL").map((uai) => ({ uai }));

  return mergeArray(from, uais, "uai", newArray).map((item) => {
    return {
      ...item,
      valide: validateUAI(item.uai),
    };
  });
}

async function mergeRelations(from, relations, newRelations) {
  let array = mergeArray(from, relations, "siret", newRelations);

  return Promise.all(
    array.map(async (r) => {
      let count = await dbCollection("etablissements").countDocuments({ siret: r.siret });
      return {
        ...r,
        referentiel: count > 0,
      };
    })
  );
}

function mergeContacts(from, contacts, newContacts) {
  return mergeArray(from, contacts, "email", newContacts, (found, contact) => {
    return {
      confirmé: contact.confirmé || false,
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
      let {
        from,
        selector,
        uais = [],
        contacts = [],
        relations = [],
        reseaux = [],
        diplomes = [],
        certifications = [],
        lieux_de_formation = [],
        data = {},
        statuts = [],
        anomalies = [],
      } = res;

      stats[from].total++;
      let query = buildQuery(selector);
      let etablissement = await dbCollection("etablissements").findOne(query);
      if (!etablissement) {
        logger.trace(`[Collect][${from}] Etablissement ${query} inconnu`);
        stats[from].ignored++;
        return;
      }

      try {
        if (anomalies.length > 0) {
          stats[from].failed++;
          await handleAnomalies(from, etablissement, anomalies);
        }

        let res = await dbCollection("etablissements").updateOne(query, {
          $set: {
            ...flattenObject(data),
            uais: mergeUAI(from, etablissement.uais, uais),
            relations: await mergeRelations(from, etablissement.relations, relations),
            contacts: mergeContacts(from, etablissement.contacts, contacts),
            diplomes: mergeArray(from, etablissement.diplomes, "code", diplomes),
            certifications: mergeArray(from, etablissement.certifications, "code", certifications),
            lieux_de_formation: mergeArray(from, etablissement.lieux_de_formation, "code", lieux_de_formation),
          },
          $addToSet: {
            reseaux: {
              $each: reseaux,
            },
            statuts: {
              $each: statuts,
            },
          },
        });

        let nbModifiedDocuments = res.modifiedCount;
        if (nbModifiedDocuments) {
          stats[from].updated += nbModifiedDocuments;
          logger.debug(`[Collect][${from}] Etablissement ${etablissement.siret} mis à jour`);
        } else {
          logger.trace(`[Collect][${from}] Etablissement ${etablissement.siret} déjà à jour`);
        }
      } catch (e) {
        stats[from].failed++;
        await handleAnomalies(from, etablissement, [e]);
      }
    })
  );

  return stats;
};
