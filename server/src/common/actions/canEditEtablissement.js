const { dbCollection } = require("../db/mongodb");

async function canEditEtablissement(siret, user) {
  let count = await dbCollection("etablissements").count({
    siret,
    [`adresse.${user.type}.code`]: user.code,
  });
  return count > 0;
}

module.exports = canEditEtablissement;
