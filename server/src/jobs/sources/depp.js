const { compose, transformData } = require("oleoduc");
const csv = require("csv-parse");
const { getOvhFileAsStream } = require("../../common/utils/ovhUtils");

module.exports = (custom = {}) => {
  let name = "depp";

  return {
    name,
    async stream() {
      let input = custom.input || (await getOvhFileAsStream("annuaire/DEPP-CFASousConvRegionale_17122020_1.csv"));

      return compose(
        input,
        csv({
          delimiter: ";",
          trim: true,
          bom: true,
          columns: true,
        }),
        transformData((data) => {
          return {
            from: name,
            selector: data["numero_siren_siret_uai"],
            uai_potentiels: [data["numero_uai"]],
          };
        })
      );
    },
  };
};
