const CatalogueApi = require("../apis/CatalogueApi");

async function isCollected(organisme, annee, api = new CatalogueApi()) {
  let etablissement = await api.getEtablissement({ siret: organisme.siret });
  return etablissement && etablissement?.tags?.includes(annee);
}

module.exports = isCollected;
