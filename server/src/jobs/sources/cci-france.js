const { compose, transformData } = require("oleoduc");
const csv = require("csv-parse");
const { getOvhFileAsStream } = require("../../common/utils/ovhUtils");

module.exports = (custom = {}) => {
  let name = "cci-france";

  return {
    name,
    async stream() {
      let input =
        custom.input || (await getOvhFileAsStream("cfas-reseaux/cfas-cci-france.csv", { storage: "mna-flux" }));

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
            selector: data["uai"],
            reseaux: ["cci-france"],
          };
        })
      );
    },
  };
};
