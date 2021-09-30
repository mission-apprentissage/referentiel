const { oleoduc, transformData } = require("oleoduc");
const TcoApi = require("../../common/apis/TcoApi");

module.exports = (custom = {}) => {
  let name = "catalogue-etablissements";
  let api = custom.tcoAPI || new TcoApi();

  return {
    name,
    async stream() {
      let stream = await api.streamEtablissements({}, { limit: 100000 });

      return oleoduc(
        stream,
        transformData(({ uai, siret }) => {
          return {
            from: name,
            selector: siret.trim(),
            uais: uai ? [uai] : [],
          };
        }),
        { promisify: false }
      );
    },
  };
};
