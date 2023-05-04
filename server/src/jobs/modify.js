const { dbCollection } = require("../common/db/mongodb");

async function modify(siret, uai) {
  let modification = {
    siret: siret,
    date: new Date(),
    auteur: "commandline",
    changements: { uai: uai },
    original: {},
  };
  return dbCollection("modifications").insertOne(modification);
}

module.exports = modify;
