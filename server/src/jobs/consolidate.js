const logger = require("../common/logger").child({ context: "consolidate" });
const { dbCollection } = require("../common/db/mongodb");

async function consolidate() {
  let stats = { total: 0, modifications: 0, unknown: 0, failed: 0 };

  for await (const { siret, changements } of dbCollection("modifications").find().sort({ date: 1 }).stream()) {
    try {
      stats.total++;
      let res = await dbCollection("organismes").updateOne({ siret }, { $set: changements });

      if (res.modifiedCount) {
        stats.modifications++;
      } else if (res.matchedCount === 0) {
        stats.unknown++;
      }
    } catch (e) {
      logger.error(e, `Impossible d'ajouter la modification pour l'organisme ${siret}`);
      stats.failed++;
    }
  }

  return stats;
}

module.exports = consolidate;
