const { compose } = require("oleoduc");
const { dbCollection } = require("../common/db/mongodb");
const transformOrganismeIntoCsv = require("../common/actions/transformOrganismeIntoCsv");

async function exportOrganismes(options = {}) {
  let filter = options.filter || {};
  let limit = options.limit || Number.MAX_SAFE_INTEGER;

  return compose(
    dbCollection("organismes")
      .find({ ...filter })
      .limit(limit)
      .sort({ siret: 1 })
      .stream(),
    transformOrganismeIntoCsv()
  );
}

module.exports = exportOrganismes;
