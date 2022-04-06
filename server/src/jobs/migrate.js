const { configureIndexes, configureValidation, dbCollection } = require("../common/db/mongodb");
const collectSources = require("./collectSources");
const { createSource } = require("./sources/sources");
const importDatagouv = require("./importDatagouv");

const VERSION = 7;

async function tasks() {
  await importDatagouv();

  let { modifiedCount } = await dbCollection("organismes").updateMany(
    {},
    { $unset: { numero_declaration_activite: 1, qualiopi: 1 } }
  );

  let collected = await collectSources(createSource("datagouv"));

  return {
    unset: modifiedCount,
    collected,
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
