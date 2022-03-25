const { configureIndexes, configureValidation, dbCollection } = require("../common/db/mongodb");

const VERSION = 6;

async function tasks() {
  return {
    renameFields: await dbCollection("organismes").updateMany(
      { nature: { $exists: false } },
      { $set: { nature: "inconnue" } }
    ),
  };
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
  let res = await tasks();
  await _saveMigration();
  return res;
}

module.exports = migrate;
