const { dbCollection } = require("../../common/db/mongodb");

async function setUAI(siret, uai, auteur) {
  let found = await dbCollection("organismes").findOne({ siret });
  if (!found) {
    return null;
  }

  await dbCollection("modifications").insertOne({
    siret,
    date: new Date(),
    auteur,
    original: {
      ...(found.uai ? { uai: found.uai } : {}),
    },
    changements: {
      uai,
    },
  });

  let res = await dbCollection("organismes").findOneAndUpdate(
    { siret },
    { $set: { uai } },
    { returnDocument: "after" }
  );

  return res.value;
}

module.exports = setUAI;
