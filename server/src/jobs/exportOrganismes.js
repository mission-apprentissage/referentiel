const { compose } = require("oleoduc");
const { dbCollection } = require("../common/db/mongodb");
const transformOrganisme = require("../common/actions/transformOrganisme");

async function exportOrganismes(options = {}) {
  let filter = options.filter || {};
  let limit = options.limit || Number.MAX_SAFE_INTEGER;

  return compose(
    dbCollection("organismes")
      .find({ ...filter })
      .limit(limit)
      .sort({ siret: 1 })
      .stream(),
    transformOrganisme.intoCsv()
  );
}

module.exports = exportOrganismes;
