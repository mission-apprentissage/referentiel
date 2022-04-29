const { mergeStreams, oleoduc, writeData } = require("oleoduc");
const { isEmpty, castArray } = require("lodash");
const logger = require("../common/logger").child({ context: "import" });
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

function isSiretValid(siret) {
  return !isEmpty(siret) && siret.length === 14 && luhn(siret);
}

function getStreams(sources) {
  return Promise.all(
    sources.map((source) => {
      logger.info(`Import des organimes contenus dans le référentiel : ${source.name}...`);
      return source.referentiel();
    })
  );
}

module.exports = async (array) => {
  let sources = castArray(array);
  let streams = await getStreams(sources);
  let stats = createStats(sources);

  await oleoduc(
    mergeStreams(streams),
    writeData(async ({ from, siret }) => {
      stats[from].total++;
      if (!isSiretValid(siret)) {
        stats[from].invalid++;
        logger.warn(`Impossible d'importer le siret '${siret}' car il est invalide.`);
        return;
      }

      try {
        let res = await dbCollection("organismes").updateOne(
          { siret },
          {
            $set: {
              siret,
            },
            $setOnInsert: {
              nature: "inconnue",
              uai_potentiels: [],
              contacts: [],
              relations: [],
              lieux_de_formation: [],
              reseaux: [],
              diplomes: [],
              certifications: [],
              "_meta.date_import": new Date(),
              "_meta.anomalies": [],
            },
            $addToSet: {
              referentiels: from,
            },
          },
          { upsert: true }
        );

        if (res.upsertedCount) {
          logger.debug(`Organisme ${siret} créé`);
          stats[from].created += res.upsertedCount;
        } else if (res.modifiedCount) {
          stats[from].updated += res.modifiedCount;
          logger.debug(`Organisme ${siret} mis à jour`);
        } else {
          logger.trace(`Organisme ${siret} déjà à jour`);
        }
      } catch (e) {
        stats[from].failed++;
        logger.error(e, `Impossible d'ajouter l'organisme ${siret}`);
      }
    })
  );

  return stats;
};
