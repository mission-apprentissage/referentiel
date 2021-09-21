const { oleoduc, writeData, mergeStreams } = require("oleoduc");
const { isEmpty } = require("lodash");
const logger = require("../common/logger");
const { dbCollection } = require("../common/db/mongodb");

module.exports = async (array) => {
  let sources = Array.isArray(array) ? array : [array];
  let streams = await Promise.all(sources.map((source) => source.stream()));
  let stats = {
    total: 0,
    created: 0,
    updated: 0,
    failed: 0,
  };

  await oleoduc(
    mergeStreams(streams),
    writeData(async ({ from, selector: siret }) => {
      stats.total++;
      if (isEmpty(siret)) {
        stats.failed++;
        logger.debug(`[Referentiel] Siret invalide pour l'établissement ${siret}`);
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
              uais: [],
              contacts: [],
              relations: [],
              lieux_de_formation: [],
              reseaux: [],
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
          logger.info(`[Referentiel] Etablissement ${siret} created`);
          stats.created += res.upsertedCount;
        } else if (res.modifiedCount) {
          stats.updated += res.modifiedCount;
          logger.info(`[Referentiel] Etablissement ${siret} updated`);
        }
      } catch (e) {
        stats.failed++;
        logger.error(e, `[Referentiel] Impossible d'ajouter le document avec le siret ${siret}`);
      }
    })
  );

  return stats;
};
