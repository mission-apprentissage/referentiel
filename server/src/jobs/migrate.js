const { configureIndexes, configureValidation, dbCollection } = require("../common/db/mongodb");

const VERSION = 10;

async function tasks() {
  return {
    clearAnomalies: await dbCollection("organismes").updateMany({}, { $set: { "_meta.anomalies": [] } }),
  };
}

async function _ensureMigrationCanBeRun() {
  const count = await dbCollection("migrations").count({ version: VERSION });
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
  const res = await tasks();
  await _saveMigration();
  return res;
}

module.exports = migrate;
