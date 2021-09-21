const logger = require("../common/logger");
const { dbCollection } = require("../common/db/mongodb");
const { promiseAllProps } = require("../common/utils/asyncUtils");

function clearCollection(name) {
  logger.warn(`Suppresion des données de la collection ${name}...`);
  return dbCollection(name)
    .deleteMany({})
    .then((res) => res.deletedCount);
}
async function clearAll() {
  return promiseAllProps({
    etablissements: clearCollection("etablissements"),
    cfd: clearCollection("cfd"),
  });
}

module.exports = clearAll;
