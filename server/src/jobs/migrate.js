const { migrateMongodb } = require("../common/db/mongodb.js");

const VERSION = 15;

async function migrate(options = {}) {
  return migrateMongodb(
    VERSION,
    () => {
      return {};
    },
    options
  );
}

module.exports = migrate;
