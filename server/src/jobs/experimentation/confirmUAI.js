const { oleoduc, writeData } = require("oleoduc");
const { parseCsv } = require("../../common/utils/csvUtils");
const { dbCollection } = require("../../common/db/mongodb");
const logger = require("../../common/logger");

async function updateEtablissementUAI(siret, uai) {
  let count = await dbCollection("etablissements").countDocuments({ uai });
  if (count > 0) {
    throw new Error("UAI déjà confirmé");
  }

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
        stats.updated += await updateEtablissementUAI(siret, uai);
      } catch (e) {
        logger.error(e, `Impossible de confirmer l'uai ${uai} pour l'établissement ${siret}`);
        stats.failed++;
      }
    })
  );
  return stats;
}

module.exports = confirmUAI;
