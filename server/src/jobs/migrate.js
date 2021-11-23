const { configureIndexes, configureValidation } = require("../common/db/mongodb");

async function migrate(options = {}) {
  await configureIndexes({ dropIndexes: options.dropIndexes || false });
  await configureValidation();
  //Add migration stuff here
}

module.exports = migrate;
