const { configureIndexes, configureValidation, dbCollection } = require("../common/db/mongodb");
const { oleoduc, writeData } = require("oleoduc");

const VERSION = 5;

async function renameFields() {
  let stats = { updated: 0 };
  return oleoduc(
    dbCollection("organismes").find().stream(),
    writeData(async (organisme) => {
      let nbNatures = organisme.natures.length;

      let res = await dbCollection("organismes").updateOne(
        { siret: organisme.siret },
        {
          $unset: { natures: 1 },
          $rename: { "_meta.import_date": "_meta.date_import" },
          ...(nbNatures > 0
            ? { $set: { nature: nbNatures === 1 ? organisme.natures[0] : "responsable_formateur" } }
            : {}),
        }
      );

      if (res.modifiedCount) {
        stats.updated++;
      }

      return stats;
    }),
    { parallel: 5 }
  );
}

async function tasks() {
  return {
    renameFields: await renameFields(),
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
