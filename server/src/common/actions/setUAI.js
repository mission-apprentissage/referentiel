const { dbCollection } = require("../../common/db/mongodb");

async function setUAI(organisme, uai) {
  const res = await dbCollection("organismes").findOneAndUpdate(
    { siret: organisme.siret },
    { $set: { uai } },
    { returnDocument: "after" }
  );

  return res.value;
}

module.exports = setUAI;
