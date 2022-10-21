const { migrateMongodb, dbCollection, configureIndexes } = require("../common/db/mongodb.js");

const VERSION = 17;

async function migrate(options = {}) {
  return migrateMongodb(
    VERSION,
    async () => {
      return {
        indexes: await configureIndexes(),
        reseaux: await dbCollection("organismes").updateMany({}, [{ $set: { reseaux: [] } }]),
      };
    },
    options
  );
}

module.exports = migrate;
