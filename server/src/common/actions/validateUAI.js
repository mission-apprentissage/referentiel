const { dbCollection } = require("../../common/db/mongodb");

async function validateUAI(siret, uai) {
  await dbCollection("modifications").insertOne({
    siret,
    uai,
    _meta: { created_at: new Date() },
  });

  let res = await dbCollection("etablissements").findOneAndUpdate(
    { siret },
    { $set: { uai } },
    { returnDocument: "after" }
  );

  return res.value;
}

module.exports = validateUAI;
