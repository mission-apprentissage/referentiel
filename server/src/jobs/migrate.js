const { configureIndexes, configureValidation, dbCollection } = require("../common/db/mongodb");

const VERSION = 3;

async function _tasks() {
  return {
    renameStatus: await dbCollection("organismes").updateMany({}, { $rename: { statuts: "natures" } }),
    renameGestionnaireStatuts: await dbCollection("organismes").updateMany(
      { natures: "gestionnaire" },
      { $set: { "natures.$": "responsable" } }
    ),
    renameGestionnaireType: await dbCollection("organismes").updateMany(
      { "relations.type": "gestionnaire" },
      { $set: { "relations.$[q].type": "formateur->responsable" } },
      {
        arrayFilters: [
          {
            "q.type": "gestionnaire",
          },
        ],
      }
    ),
    renameFormateurType: await dbCollection("organismes").updateMany(
      { "relations.type": "formateur" },
      { $set: { "relations.$[q].type": "responsable->formateur" } },
      {
        arrayFilters: [
          {
            "q.type": "formateur",
          },
        ],
      }
    ),
    renameEntrepriseType: await dbCollection("organismes").updateMany(
      { relations: { $elemMatch: { type: { $exists: false } } } },
      { $set: { "relations.$[q].type": "entreprise" } },
      {
        arrayFilters: [
          {
            "q.sources": "sirene",
          },
        ],
      }
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
  let res = await _tasks();
  await _saveMigration();
  return res;
}

module.exports = migrate;
