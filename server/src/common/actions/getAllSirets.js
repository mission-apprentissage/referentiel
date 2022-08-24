const { dbCollection } = require("../db/mongodb.js");

async function getAllSirets() {
  const res = await dbCollection("organismes")
    .find({}, { projection: { siret: 1 } })
    .toArray();

  return res.map((r) => r.siret);
}

module.exports = getAllSirets;
