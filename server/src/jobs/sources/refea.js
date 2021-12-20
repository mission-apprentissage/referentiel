const { compose, transformData } = require("oleoduc");
const { getOvhFileAsStream } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");

module.exports = (custom = {}) => {
  let name = "refea";

  return {
    name,
    async stream() {
      let input = custom.input || (await getOvhFileAsStream("annuaire/REFEA-liste-uai-avec-coordonnees.csv"));

      return compose(
        input,
        parseCsv({
          delimiter: ";",
          trim: true,
          bom: true,
          columns: true,
        }),
        transformData((data) => {
          return {
            from: name,
            selector: data["uai_code_siret"],
            uai_potentiels: [data["uai_code_educnationale"]],
          };
        })
      );
    },
  };
};
