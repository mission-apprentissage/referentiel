const { getRegions } = require("../common/regions");
const { buildApiToken } = require("../common/utils/jwtUtils");
const { compose, transformIntoCSV } = require("oleoduc");
const { Readable } = require("stream");
const config = require("../config");
const { getAcademies } = require("../common/academies");

function getItems(type) {
  switch (type) {
    case "region":
      return getRegions();
    case "academie":
      return getAcademies();
    default:
      throw new Error(`Type ${type} invalide`);
  }
}

function generateMagicLinks(type, options = {}) {
  let url = options.url || config.publicUrl;
  let links = getItems(type).map((item) => {
    let token = buildApiToken(type, item.code);
    return { Région: item.nom, Lien: `${url}/login?token=${token}` };
  });

  return compose(Readable.from(links), transformIntoCSV());
}

module.exports = generateMagicLinks;
