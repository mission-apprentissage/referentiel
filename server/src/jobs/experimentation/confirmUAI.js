const { oleoduc, writeData } = require("oleoduc");
const { parseCsv } = require("../../common/utils/csvUtils");
const { dbCollection } = require("../../common/db/mongodb");
const logger = require("../../common/logger");

async function updateEtablissementUAI(siret, uai) {
  let res = await dbCollection("etablissements").updateOne(
    {
      siret,
    },
    {
      $set: {
        uai,
      },
    }
  );
  return res.modifiedCount;
}

async function confirmUAI(csvStream) {
  let stats = { total: 0, updated: 0, unknown: 0, failed: 0 };

  await oleoduc(
    csvStream,
    parseCsv(),
    writeData(async (data) => {
      let siret = data.siret;
      let uai = data.uai;
      if (!siret || !uai) {
        return;
      }

      stats.total++;
      try {
        let updated = await updateEtablissementUAI(siret, uai);
        if (updated) {
          stats.updated += updated;
        } else {
          stats.unknown++;
        }
      } catch (e) {
        logger.error(e, `Impossible de confirmer l'uai ${uai} pour l'établissement ${siret}`);
        stats.failed++;
      }
    })
  );
  return stats;
}

module.exports = confirmUAI;
