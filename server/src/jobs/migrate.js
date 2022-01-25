const { configureIndexes, configureValidation, dbCollection } = require("../common/db/mongodb");

const VERSION = 3;

async function tasks() {
  return {
    renameStatus: await dbCollection("organismes").updateMany({}, { $rename: { statuts: "natures" } }),
    renameGestionnaireStatuts: await dbCollection("organismes").updateMany(
      { natures: "gestionnaire" },
      { $set: { "natures.$": "responsable" } }
    ),
    unsetQualiopi: await dbCollection("organismes").updateMany(
      { qualiopi: { $exists: true } },
      { $unset: { qualiopi: 1 } }
    ),
    clearRelations: await dbCollection("organismes").updateMany(
      { "relations.0": { $exists: true } },
      { $set: { relations: [] } }
    ),
    clearAnomalies: await dbCollection("organismes").updateMany(
      { "_meta.anomalies.0": { $exists: true } },
      { $set: { "_meta.anomalies": [] } }
    ),
    clearUAIPotentiels: await dbCollection("organismes").updateMany(
      { "uai_potentiels.0": { $exists: true } },
      { $set: { uai_potentiels: [] } }
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
