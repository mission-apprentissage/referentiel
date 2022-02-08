const { compose, transformData } = require("oleoduc");
const { getFromStorage } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");

module.exports = (custom = {}) => {
  let name = "ifocop";

  return {
    name,
    async stream() {
      let input = custom.input || (await getFromStorage("ifocop.csv"));

      return compose(
        input,
        parseCsv(),
        transformData((data) => {
          return {
            from: name,
            selector: data.SIRET,
            reseaux: ["ifocop"],
            uai_potentiels: [data.UAI],
          };
        })
      );
    },
  };
};
