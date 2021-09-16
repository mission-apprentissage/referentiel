const { oleoduc, transformData, readLineByLine } = require("oleoduc");
const TcoApi = require("../../common/apis/TcoApi");

module.exports = (custom = {}) => {
  let name = "tables-de-correspondances";
  let api = custom.tcoAPI || new TcoApi();

  return {
    name,
    async stream() {
      let etablissementsStream = await api.getEtablissements({});

      return oleoduc(
        etablissementsStream,
        readLineByLine(),
        transformData((data) => {
          let json = JSON.parse(data);
          return {
            from: name,
            selector: json.siret.trim(),
            uais: json.uai ? [json.uai] : [],
          };
        }),
        { promisify: false }
      );
    },
  };
};
