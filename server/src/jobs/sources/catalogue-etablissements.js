const { compose, transformData } = require("oleoduc");
const CatalogueApi = require("../../common/apis/CatalogueApi");

function streamEtablissements(api) {
  return api.streamEtablissements({ published: true }, { limit: 100000 });
}

module.exports = (custom = {}) => {
  const name = "catalogue-etablissements";
  const api = custom.catalogueAPI || new CatalogueApi();

  return {
    name,
    async referentiel() {
      const stream = await streamEtablissements(api);

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
      const stream = await streamEtablissements(api);

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
