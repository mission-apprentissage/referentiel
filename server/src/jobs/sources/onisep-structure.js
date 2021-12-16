const { compose, transformData } = require("oleoduc");
const csv = require("csv-parse");
const { getOvhFileAsStream } = require("../../common/utils/ovhUtils");

module.exports = (custom = {}) => {
  let name = "onisep-structure";

  return {
    name,
    async stream() {
      let input = custom.input || (await getOvhFileAsStream("annuaire/ONISEP-Structures-20012021PL.csv"));

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
            selector: data["STRUCT SIRET"],
            uai_potentiels: [data["STRUCT UAI"]],
          };
        })
      );
    },
  };
};
