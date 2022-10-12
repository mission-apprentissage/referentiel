const { migrateMongodb, dbCollection } = require("../common/db/mongodb.js");

const VERSION = 16;

async function migrate(options = {}) {
  return migrateMongodb(
    VERSION,
    async () => {
      return {
        dernier_import: await dbCollection("organismes").updateMany({}, [
          { $set: { "_meta.date_dernier_import": "$_meta.date_import" } },
        ]),
      };
    },
    options
  );
}

module.exports = migrate;
