const { dbCollection } = require("../../common/db/mongodb");

async function validateUAI(siret, uai, auteur) {
  await dbCollection("modifications").insertOne({
    siret,
    uai,
    date: new Date(),
    auteur,
  });

  let res = await dbCollection("etablissements").findOneAndUpdate(
    { siret },
    { $set: { uai } },
    { returnDocument: "after" }
  );

  return res.value;
}

module.exports = validateUAI;
