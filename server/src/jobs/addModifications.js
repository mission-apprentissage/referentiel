const { compose } = require("oleoduc");
const { parseCsv } = require("../common/utils/csvUtils");
const logger = require("../common/logger");
const { dbCollection } = require("../common/db/mongodb");

async function addModifications(stream) {
  let stats = { total: 0, inserted: 0, invalid: 0, failed: 0 };
  let csvStream = compose(stream, parseCsv());

  for await (const data of csvStream) {
    stats.total++;

    let siret = data.siret;
    let uai = data.uai;
    if (!siret || !uai) {
      stats.invalid++;
      continue;
    }

    try {
      await dbCollection("modifications").insertOne({
        siret,
        uai,
        _meta: { created_at: new Date() },
      });
      stats.inserted++;
    } catch (e) {
      logger.error(e, `Impossible d'ajouter la modification pour l'uai ${uai} et l'établissement ${siret}`);
      stats.failed++;
    }
  }

  return stats;
}

module.exports = addModifications;
