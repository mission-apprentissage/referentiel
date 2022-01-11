const { dbCollection } = require("../../common/db/mongodb");

function addModification(auteur, organisme, changements) {
  return dbCollection("modifications").insertOne({
    siret: organisme.siret,
    date: new Date(),
    auteur,
    original: {
      ...(organisme.uai ? { uai: organisme.uai } : {}),
    },
    changements,
  });
}

module.exports = addModification;
