const { oleoduc, writeData } = require("oleoduc");
const { pick } = require("lodash");
const unzip = require("unzip-stream");
const miniget = require("miniget");
const logger = require("../common/logger");
const { parseCsv } = require("../common/utils/csvUtils");
const { dbCollection } = require("../common/db/mongodb");

function getFileAsStream(url, options = {}) {
  logger.debug(`Téléchargement de ${url}...`);
  return miniget(url, options);
}

function parseZip(zipStream, onEntry) {
  return new Promise((resolve) => {
    let zip = zipStream.pipe(unzip.Parse());
    zip.on("entry", (entry) => {
      onEntry(entry).then(() => resolve());
    });
  });
}

function str(v) {
  return v || "";
}

function getAdresseAsString(data) {
  return (
    `${str(data.numeroVoieEtablissement)} ` +
    `${str(data.indiceRepetitionEtablissement)} ` +
    `${str(data.typeVoieEtablissement)} ` +
    `${str(data.libelleVoieEtablissement)} ` +
    `${str(data.codePostalEtablissement)} ` +
    `${str(data.libelleCommuneEtablissement)}`
  )
    .replace(/\s{2,}/g, " ")
    .trim();
}

async function importEtablissements(archive) {
  let stats = { total: 0, created: 0, updated: 0, errors: 0 };
  await parseZip(archive, (entry) => {
    return oleoduc(
      entry,
      parseCsv({ delimiter: "," }),
      writeData(
        async (data) => {
          try {
            stats.total++;
            let siret = data.siret;

            let res = await dbCollection("sirene").updateOne(
              { siret },
              {
                $set: {
                  ...pick(data, [
                    "siren",
                    "nic",
                    "siret",
                    "codePostalEtablissement",
                    "codeCommuneEtablissement",
                    "etatAdministratifEtablissement",
                    "enseigne1Etablissement",
                    "enseigne2Etablissement",
                    "enseigne3Etablissement",
                    "denominationUsuelleEtablissement",
                  ]),
                  adresse: getAdresseAsString(data),
                },
              },
              { upsert: true }
            );

            let created = res.upsertedCount;
            let modified = res.modifiedCount;
            if (created) {
              logger.debug(`[Sirene] Etablissement ${siret} created (${stats.total})`);
              stats.created += created || 0;
            } else if (modified) {
              logger.debug(`[Sirene] Etablissement ${siret} updated (${stats.total})`);
              stats.updated += modified || 0;
            } else {
              logger.debug(`[Sirene] Etablissement ${siret} already imported (${stats.total})`);
            }
          } catch (e) {
            stats.errors++;
            logger.error(e);
          }
        },
        { parallel: 10 }
      )
    );
  });

  return stats;
}

async function importUnitesLegales(archive) {
  let stats = { total: 0, created: 0, updated: 0, errors: 0 };

  await parseZip(archive, (entry) => {
    return oleoduc(
      entry,
      parseCsv({ delimiter: "," }),
      writeData(
        async (data) => {
          try {
            stats.total++;
            let siren = data.siren;

            let res = await dbCollection("sirene").updateMany(
              { siret: new RegExp(`^${siren}`) },
              {
                $set: pick(data, [
                  "nomUniteLegale",
                  "nomUsageUniteLegale",
                  "denominationUniteLegale",
                  "denominationUsuelle1UniteLegale",
                  "denominationUsuelle2UniteLegale",
                  "denominationUsuelle3UniteLegale",
                  "categorieJuridiqueUniteLegale",
                ]),
              },
              { upsert: true }
            );

            let created = res.upsertedCount;
            let modified = res.modifiedCount;
            if (created) {
              logger.debug(`[Sirene] Unité légale ${siren} created (${stats.total})`);
              stats.created += created || 0;
            } else if (modified) {
              logger.debug(`[Sirene] Unité légale ${siren} updated (${stats.total})`);
              stats.updated += modified || 0;
            } else {
              logger.debug(`[Sirene] Unité légale ${siren} already imported (${stats.total})`);
            }
          } catch (e) {
            stats.errors++;
            logger.error(e);
          }
        },
        { parallel: 10 }
      )
    );
  });

  return stats;
}

async function importSirene(options = {}) {
  let stats = {};
  await dbCollection("sirene").createIndex({ siret: 1 }, { unique: true });

  stats.etablisssements = await importEtablissements(
    options.etablissements || getFileAsStream("https://files.data.gouv.fr/insee-sirene/StockEtablissement_utf8.zip")
  );

  stats.unitesLegales = await importUnitesLegales(
    options.unitesLegales || getFileAsStream("https://files.data.gouv.fr/insee-sirene/StockUniteLegale_utf8.zip")
  );

  return stats;
}

module.exports = importSirene;
