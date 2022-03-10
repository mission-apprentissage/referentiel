const logger = require("../common/logger").child({ context: "import" });
const { getFileAsStream } = require("../common/utils/httpUtils");
const { oleoduc, writeData } = require("oleoduc");
const { dbCollection } = require("../common/db/mongodb");
const Pick = require("stream-json/filters/Pick");
const { streamArray } = require("stream-json/streamers/StreamArray");

function getContours() {
  return getFileAsStream(
    "https://static.data.gouv.fr/resources/contours-des-communes-de-france-simplifie-avec-regions-et-departement-doutre-mer-rapproches/20220219-095144/a-com2022.json"
  );
}

async function importCommunes(options = {}) {
  let stats = { total: 0, created: 0, updated: 0, failed: 0 };
  let stream = options.input || (await getContours());
  logger.info(
    `Import des contours des communes de France simplifié, avec régions et département d'outre-mer rapprochés...`
  );

  await oleoduc(
    stream,
    Pick.withParser({ filter: "features" }),
    streamArray(),
    writeData(
      async ({ value: feature }) => {
        let codgeo = feature.properties.codgeo;

        try {
          stats.total++;

          logger.debug(`Import des données geojson pour le communes avec le code INSEE ${codgeo}...`);
          let res = await dbCollection("communes").updateOne(
            {
              _id: codgeo,
            },
            {
              $set: feature,
            },
            { upsert: true }
          );

          stats.updated += res.modifiedCount;
          stats.created += res.upsertedCount;
        } catch (e) {
          logger.error(e, `Impossible d'importer les contours de la ville  ${codgeo}`);
          stats.failed++;
        }
      },
      { parallel: 5 }
    )
  );
  return stats;
}

module.exports = importCommunes;
