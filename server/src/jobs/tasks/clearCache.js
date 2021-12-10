const { dbCollection } = require("../../common/db/mongodb");

function clearCache() {
  return dbCollection("cache").remove({});
}

module.exports = clearCache;
