const { configureIndexes, configureValidation, dbCollection } = require("../common/db/mongodb");

async function migrate(options = {}) {
  await configureIndexes({ dropIndexes: options.dropIndexes || false });
  await configureValidation();
  //Add migration stuff here
  dbCollection("organismes").updateMany({}, { $unset: { conformite_reglementaire: 1 } });
}

module.exports = migrate;
