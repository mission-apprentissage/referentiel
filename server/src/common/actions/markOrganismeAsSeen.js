const { dbCollection } = require("../db/mongodb.js");

function markOrganismeAsSeen(siret, date) {
  return dbCollection("organismes").updateOne(
    { siret },
    {
      $set: { "_meta.date_vue": date },
    }
  );
}

module.exports = { markOrganismeAsSeen };
