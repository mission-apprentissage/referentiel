const { configureIndexes, configureValidation, dbCollection } = require("../common/db/mongodb");
const addModifications = require("../common/actions/addModification.js");

const VERSION = 11;

async function tasks() {
  const organisme = await dbCollection("organismes").findOne({ siret: "30721264700019" });

  return {
    addModifications: await addModifications("mna", organisme, {
      adresse: {
        label: "32 Place Pasteur 45230 Sainte-Geneviève-des-Bois",
        localite: "Sainte-Geneviève-des-Bois",
        code_insee: "45278",
        code_postal: "45230",
        departement: { code: "45", nom: "Loiret" },
        academie: { code: "18", nom: "Orléans-Tours" },
        region: { code: "24", nom: "Centre-Val de Loire" },
        geojson: {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [2.8207461340447386, 47.8185712617384],
          },
          properties: {
            score: 1,
            source: "mna",
          },
        },
      },
    }),
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
