const { dbCollection } = require("../db/mongodb");

async function canEditOrganisme(siret, user) {
  let count = await dbCollection("organismes").count({
    siret,
    [`adresse.${user.type}.code`]: user.code,
  });
  return count > 0;
}

module.exports = canEditOrganisme;
