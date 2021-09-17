const logger = require("../common/logger");
const { dbCollection } = require("../common/db/mongodb");

async function clearAll() {
  logger.warn("Suppresion de tous les établissements...");
  let res = await dbCollection("etablissements").deleteMany({});
  return { deleted: res.deletedCount };
}

module.exports = clearAll;
