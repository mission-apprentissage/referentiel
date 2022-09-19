const { configureIndexes, configureValidation, dbCollection } = require("../common/db/mongodb");
const { addModification } = require("../common/actions/addModification.js");

const VERSION = 14;

async function tasks() {
  const organisme = await dbCollection("organismes").findOne({ siret: "85124396400026" });
  return {
    addModifications: await addModification("mna", organisme, {
      adresse: {
        label: "64 Av. Valéry Giscard d'Estaing 06200 Nice",
        localite: "Nice",
        code_insee: "06088",
        code_postal: "06200",
        departement: { code: "06", nom: "Alpes-Maritimes" },
        academie: { code: "23", nom: "Nice" },
        region: { code: "93", nom: "Provence-Alpes-Côte d'Azur" },
        geojson: {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [7.20849997129837, 43.671106059602884],
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
