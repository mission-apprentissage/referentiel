const { oleoduc, writeData } = require("oleoduc");
const { parseCsv } = require("../../common/utils/csvUtils");
const { dbCollection } = require("../../common/db/mongodb");
const logger = require("../../common/logger");

async function confirmUAI(csvStream) {
  let stats = { total: 0, updated: 0, ignored: 0, failed: 0 };

  await oleoduc(
    csvStream,
    parseCsv(),
    writeData(async (data) => {
      let siret = data.siret;
      let uai = data.uai;

      stats.total++;
      if (!uai) {
        stats.ignored++;
        return;
      }
      try {
        let res = await dbCollection("etablissements").updateOne(
          {
            siret,
          },
          {
            $set: {
              uai,
              "uais.$[q].confirmé": true,
            },
          },
          {
            arrayFilters: [
              {
                "q.uai": uai,
              },
            ],
          }
        );

        stats.updated += res.modifiedCount;
      } catch (e) {
        logger.error(e, `Impossible de confirmer l'uai ${uai} pour l'établissement ${siret}`);
        stats.failed++;
      }
    })
  );
  return stats;
}

module.exports = confirmUAI;
