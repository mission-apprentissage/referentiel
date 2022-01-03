const { configureIndexes, configureValidation, dbCollection, getDatabase } = require("../common/db/mongodb");

const VERSION = 1;

async function updateModifications() {
  for await (const doc of dbCollection("modifications").find().stream()) {
    let newAuteur = doc.auteur.length === 2 ? `region-${doc.auteur}` : doc.auteur;

    await dbCollection("modifications").updateOne(
      { _id: doc._id },
      {
        $unset: { uai: 1 },
        $set: { original: {}, changements: { uai: doc.uai }, auteur: newAuteur },
      }
    );
  }
}

async function ensureMigrationCanBeRun() {
  let count = await dbCollection("migrations").count({ version: VERSION });
  if (count > 0) {
    throw new Error(`La migration ${VERSION} a déjà été réalisée`);
  }
}

function saveMigrationVersion() {
  return dbCollection("migrations").insertOne({ version: VERSION });
}

async function migrate(options = {}) {
  await ensureMigrationCanBeRun();

  //Add migration stuff here
  await configureIndexes({ dropIndexes: options.dropIndexes || false });
  await configureValidation();
  await dbCollection("organismes").updateMany({}, { $unset: { conformite_reglementaire: 1 } });
  await getDatabase().dropCollection("etablissements");
  await updateModifications();

  await saveMigrationVersion();
}

module.exports = migrate;
