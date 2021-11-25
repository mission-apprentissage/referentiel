const { compose, transformData } = require("oleoduc");
const CatalogueApi = require("../../common/apis/CatalogueApi");

module.exports = (custom = {}) => {
  let name = "catalogue-etablissements";
  let api = custom.catalogueAPI || new CatalogueApi();

  return {
    name,
    async stream() {
      let stream = await api.streamEtablissements({ catalogue_published: true }, { limit: 100000 });

      return compose(
        stream,
        transformData(({ uai, siret }) => {
          return {
            from: name,
            selector: siret.trim(),
            uais: uai ? [uai] : [],
          };
        })
      );
    },
  };
};
