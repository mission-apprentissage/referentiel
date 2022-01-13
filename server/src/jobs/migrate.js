const { configureIndexes, configureValidation, dbCollection } = require("../common/db/mongodb");

const VERSION = 2;

async function _tasks() {
  await dbCollection("organismes").updateMany(
    {},
    { $rename: { "_meta.created_at": "_meta.import_date" }, $pull: { contacts: { email: /##/ } } }
  );
}

async function _ensureMigrationCanBeRun() {
  let count = await dbCollection("migrations").count({ version: VERSION });
  if (count > 0) {
    throw new Error(`La migration ${VERSION} a déjà été réalisée`);
  }
}

async function _prepareMigration(options) {
  await configureIndexes({ dropIndexes: options.dropIndexes || false });
  await configureValidation();
}

function _saveMigration() {
  return dbCollection("migrations").insertOne({ version: VERSION });
}

async function migrate(options = {}) {
  await _ensureMigrationCanBeRun();
  await _prepareMigration(options);
  await _tasks();
  await _saveMigration();
}

module.exports = migrate;
