const { compose, transformData } = require("oleoduc");
const { getFromStorage } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");

module.exports = (custom = {}) => {
  let name = "onisep-structure";

  return {
    name,
    async stream() {
      let input = custom.input || (await getFromStorage("ONISEP-Structures-20012021PL.csv"));

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
            selector: data["STRUCT SIRET"],
            uai_potentiels: [data["STRUCT UAI"]],
          };
        })
      );
    },
  };
};
