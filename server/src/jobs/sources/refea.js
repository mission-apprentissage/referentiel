const { compose, transformData } = require("oleoduc");
const { getFromStorage } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");

module.exports = (custom = {}) => {
  const name = "refea";

  return {
    name,
    async stream() {
      const input = custom.input || (await getFromStorage("REFEA-liste-uai-avec-coordonnees.csv"));

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
