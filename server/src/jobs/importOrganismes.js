const { mergeStreams } = require("oleoduc");
const { isEmpty, castArray } = require("lodash");
const logger = require("../common/logger");
const luhn = require("fast-luhn");
const { dbCollection } = require("../common/db/mongodb");

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

module.exports = async (array) => {
  let sources = castArray(array);
  let streams = await Promise.all(sources.map((source) => source.referentiel()));
  let stats = createStats(sources);

  for await (const { from, siret } of mergeStreams(streams)) {
    stats[from].total++;
    if (isEmpty(siret) || !luhn(siret)) {
      stats[from].invalid++;
      logger.warn(`[Referentiel] Siret '${siret}' invalide pour l'organisme`);
      continue;
    }

    try {
      let res = await dbCollection("organismes").updateOne(
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
        logger.debug(`[Referentiel] Organisme ${siret} créé`);
        stats[from].created += res.upsertedCount;
      } else if (res.modifiedCount) {
        stats[from].updated += res.modifiedCount;
        logger.debug(`[Referentiel] Organisme ${siret} mis à jour`);
      }
    } catch (e) {
      stats[from].failed++;
      logger.error(e, `[Referentiel] Impossible d'ajouter le document avec le siret ${siret}`);
    }
  }

  return stats;
};
