const { dbCollection } = require("../../common/db/mongodb");
const { updatedDiff } = require("deep-object-diff"); // eslint-disable-line node/no-extraneous-require
const { omit } = require("lodash");

function addModification(auteur, email, organisme, changements) {
  const differences = updatedDiff(changements, omit(organisme, ["_id", "_meta"]));

  return dbCollection("modifications").insertOne({
    siret: organisme.siret,
    date: new Date(),
    auteur,
    email,
    original: differences,
    changements,
  });
}

module.exports = { addModification };
