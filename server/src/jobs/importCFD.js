const logger = require("../common/logger").child({ context: "import" });
const { fetchStream } = require("../common/utils/httpUtils");
const { oleoduc, writeData } = require("oleoduc");
const { pick } = require("lodash");
const { dbCollection } = require("../common/db/mongodb");
const { parseCsv } = require("../common/utils/csvUtils");
const { decodeStream } = require("iconv-lite");

async function importCsv(csvStream) {
  const stats = { total: 0, created: 0, updated: 0, failed: 0 };

  await oleoduc(
    csvStream,
    decodeStream("iso-8859-1"),
    parseCsv({
      delimiter: "|",
      skip_lines_with_error: true,
      quote: null,
    }),
    writeData(async (data) => {
      try {
        stats.total++;
        const res = await dbCollection("cfd").updateOne(
          {
            FORMATION_DIPLOME: data.FORMATION_DIPLOME,
          },
          {
            $setOnInsert: pick(data, ["FORMATION_DIPLOME", "NIVEAU_FORMATION_DIPLOME", "LIBELLE_COURT"]),
          },
          { upsert: true }
        );

        stats.updated += res.modifiedCount;
        stats.created += res.upsertedCount;
      } catch (e) {
        logger.error(e, `Impossible d'importer le code formation diplome  ${data.FORMATION_DIPLOME}`);
        stats.failed++;
      }
    })
  );
  return stats;
}

function getCsvExport(name) {
  return fetchStream(`https://infocentre.pleiade.education.fr/bcn/index.php/export/CSV?n=${name}&separator=%7C`);
}

async function importCFD(options = {}) {
  const stats = {};
  logger.info("Import des CFD...");
  const nFormationStream = options.nFormationDiplomeCsvStream || (await getCsvExport("N_FORMATION_DIPLOME"));
  stats.N_FORMATION_DIPLOME = await importCsv(nFormationStream);

  const vFormationStream = options.vFormationDiplomeCsvStream || (await getCsvExport("V_FORMATION_DIPLOME"));
  stats.V_FORMATION_DIPLOME = await importCsv(vFormationStream);

  return stats;
}

module.exports = importCFD;
