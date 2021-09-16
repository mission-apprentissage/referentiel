const logger = require("../common/logger");
const { dbCollection } = require("../common/db/mongodb");

async function clear() {
  logger.warn("Suppresion de tous les établissements de l'annuaire...");
  let res = await dbCollection("annuaire").deleteMany({});
  return { deleted: res.deletedCount };
}

module.exports = clear;
