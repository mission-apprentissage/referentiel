const { oleoduc, writeData } = require("oleoduc");
const { isEmpty } = require("lodash");
const logger = require("../common/logger");
const { dbCollection } = require("../common/db/mongodb");

module.exports = async (referentiel) => {
  let stats = {
    total: 0,
    created: 0,
    updated: 0,
    failed: 0,
  };

  await oleoduc(
    await referentiel.stream(),
    writeData(async ({ from, siret }) => {
      stats.total++;
      if (isEmpty(siret)) {
        stats.failed++;
        logger.warn(`[Referentiel] Siret invalide pour l'établissement ${siret}`);
        return;
      }

      try {
        let res = await dbCollection("annuaire").updateOne(
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
              referentiels: from || referentiel.name,
            },
          },
          { upsert: true }
        );

        if (res.upsertedCount) {
          logger.info(`[Annuaire][Referentiel] Etablissement ${siret} created`);
          stats.created += res.upsertedCount;
        } else if (res.modifiedCount) {
          stats.updated += res.modifiedCount;
          logger.info(`[Annuaire][Referentiel] Etablissement ${siret} updated`);
        }
      } catch (e) {
        stats.failed++;
        logger.error(e, `[Referentiel] Impossible d'ajouter le document avec le siret ${siret} dans l'annuaire`);
      }
    })
  );

  return stats;
};
