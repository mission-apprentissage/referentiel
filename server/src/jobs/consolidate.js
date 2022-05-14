const logger = require("../common/logger").child({ context: "consolidate" });
const { dbCollection } = require("../common/db/mongodb");
const findUAIProbable = require("../common/actions/findUAIProbable");

// eslint-disable-next-line no-unused-vars
async function validateUAI() {
  const stats = { total: 0, modifications: 0, unknown: 0, failed: 0 };
  for await (const organisme of dbCollection("organismes").find().stream()) {
    try {
      stats.total++;
      const probable = findUAIProbable(organisme);

      if (probable) {
        await dbCollection("organismes").updateOne({ siret: organisme.siret }, { $set: { uai: probable.uai } });
        stats.modifications++;
      } else {
        stats.unknown++;
      }
    } catch (e) {
      logger.error(e, `Impossible de modifier l'uai pour l'organisme ${organisme.siret}`);
      stats.failed++;
    }
  }
  return stats;
}

async function applyModifcations() {
  const stats = { total: 0, modifications: 0, unknown: 0, failed: 0 };

  for await (const { siret, changements } of dbCollection("modifications").find().sort({ date: 1 }).stream()) {
    try {
      stats.total++;
      const res = await dbCollection("organismes").updateOne({ siret }, { $set: changements });

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

async function consolidate() {
  const stats = {};
  //stats.uai = await validateUAI();
  stats.modifications = await applyModifcations();
  return stats;
}

module.exports = consolidate;
