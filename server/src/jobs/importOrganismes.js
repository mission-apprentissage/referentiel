const { mergeStreams, oleoduc, writeData } = require("oleoduc");
const { castArray } = require("lodash");
const logger = require("../common/logger").child({ context: "import" });
const { dbCollection } = require("../common/db/mongodb");
const { isSiretValid } = require("../common/utils/validationUtils");

function markOrganismeAsImported(siret, date) {
  return dbCollection("organismes").updateOne(
    { siret },
    {
      $set: { "_meta.date_dernier_import": date },
    }
  );
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

function getStreams(sources) {
  return Promise.all(
    sources.map((source) => {
      logger.info(`Import des organimes contenus dans le référentiel : ${source.name}...`);
      return source.referentiel();
    })
  );
}

module.exports = async (array) => {
  const sources = castArray(array);
  const streams = await getStreams(sources);
  const stats = createStats(sources);
  const importDate = new Date();

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
        const res = await dbCollection("organismes").updateOne(
          { siret },
          {
            $set: {
              siret,
            },
            $setOnInsert: {
              "nature": "inconnue",
              "uai_potentiels": [],
              "contacts": [],
              "relations": [],
              "lieux_de_formation": [],
              "reseaux": [],
              "diplomes": [],
              "certifications": [],
              "_meta.date_import": importDate,
              "_meta.date_dernier_import": importDate,
              "_meta.anomalies": [],
            },
            $addToSet: {
              referentiels: from,
            },
          },
          { upsert: true }
        );

        await markOrganismeAsImported(siret, importDate);

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
