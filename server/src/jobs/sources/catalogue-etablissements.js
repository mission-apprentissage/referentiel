const { compose, transformData } = require("oleoduc");
const CatalogueApi = require("../../common/apis/CatalogueApi");

function streamEtablissements(api) {
  return api.streamEtablissements({ catalogue_published: true }, { limit: 100000 });
}

module.exports = (custom = {}) => {
  let name = "catalogue-etablissements";
  let api = custom.catalogueAPI || new CatalogueApi();

  return {
    name,
    async referentiel() {
      let stream = await streamEtablissements(api);

      return compose(
        stream,
        transformData(({ siret }) => {
          return {
            from: name,
            siret: siret.trim(),
          };
        })
      );
    },
    async stream() {
      let stream = await streamEtablissements(api);

      return compose(
        stream,
        transformData(({ uai, siret }) => {
          return {
            from: name,
            selector: siret.trim(),
            uai_potentiels: uai ? [uai] : [],
          };
        })
      );
    },
  };
};
