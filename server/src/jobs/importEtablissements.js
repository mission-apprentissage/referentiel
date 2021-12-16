const { oleoduc, mergeStreams, writeData } = require("oleoduc");
const { isEmpty } = require("lodash");
const logger = require("../common/logger");
const luhn = require("fast-luhn");
const { dbCollection, clearCollection } = require("../common/db/mongodb");

async function getStreams(sources) {
  return Promise.all(sources.map((source) => source.stream()));
}

function createStats(sources) {
  return sources.reduce((acc, source) => {
    return {
      ...acc,
      [source.name]: {
        total: 0,
        created: 0,
        updated: 0,
        invalid: 0,
        failed: 0,
      },
    };
  }, {});
}

module.exports = async (array, options = {}) => {
  let sources = Array.isArray(array) ? array : [array];
  let streams = await getStreams(sources);
  let stats = createStats(sources);

  if (options.removeAll) {
    await clearCollection("etablissements");
  }

  await oleoduc(
    mergeStreams(streams),
    writeData(async ({ from, selector: siret }) => {
      stats[from].total++;
      if (isEmpty(siret) || !luhn(siret)) {
        stats[from].invalid++;
        logger.warn(`[Referentiel] Siret '${siret}' invalide pour l'établissement`);
        return;
      }

      try {
        let res = await dbCollection("etablissements").updateOne(
          { siret },
          {
            $set: {
              siret,
            },
            $setOnInsert: {
              uai_potentiels: [],
              contacts: [],
              relations: [],
              lieux_de_formation: [],
              reseaux: [],
              statuts: [],
              diplomes: [],
              certifications: [],
              "_meta.created_at": new Date(),
              "_meta.anomalies": [],
            },
            $addToSet: {
              referentiels: from,
            },
          },
          { upsert: true }
        );

        if (res.upsertedCount) {
          logger.debug(`[Referentiel] Etablissement ${siret} créé`);
          stats[from].created += res.upsertedCount;
        } else if (res.modifiedCount) {
          stats[from].updated += res.modifiedCount;
          logger.debug(`[Referentiel] Etablissement ${siret} mis à jour`);
        }
      } catch (e) {
        stats[from].failed++;
        logger.error(e, `[Referentiel] Impossible d'ajouter le document avec le siret ${siret}`);
      }
    })
  );

  return stats;
};
