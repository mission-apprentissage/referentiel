const logger = require("../common/logger");
const { getCollection } = require("../common/db/mongodb");

async function clear() {
  logger.warn("Suppresion de tous les établissements de l'annuaire...");
  let res = await getCollection("annuaire").deleteMany({});
  return { deleted: res.deletedCount };
}

module.exports = clear;
