const logger = require("../common/logger");
const { dbCollection } = require("../common/db/mongodb");

async function consolidate() {
  let stats = { total: 0, updated: 0, unknown: 0, failed: 0 };

  for await (const { siret, uai } of dbCollection("modifications").find().stream()) {
    try {
      stats.total++;
      let res = await dbCollection("etablissements").updateOne({ siret }, { $set: { uai } });

      if (res.modifiedCount) {
        stats.updated++;
      } else if (res.matchedCount === 0) {
        stats.unknown++;
      }
    } catch (e) {
      logger.error(e, `Impossible d'ajouter la modification pour l'uai ${uai} et l'établissement ${siret}`);
      stats.failed++;
    }
  }

  return stats;
}

module.exports = consolidate;
