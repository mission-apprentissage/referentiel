const { compose, transformData, filterData } = require("oleoduc");
const { getFromStorage } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");

module.exports = (custom = {}) => {
  let name = "ccca-btp";

  return {
    name,
    async stream() {
      let input = custom.input || (await getFromStorage("cfas-reseaux/cfas-ccca-btp.csv", { storage: "mna-flux" }));

      return compose(
        input,
        parseCsv({
          delimiter: ";",
          trim: true,
          bom: true,
          columns: true,
        }),
        filterData((data) => data.uai),
        transformData((data) => {
          return {
            from: name,
            selector: { uai: data["uai"] },
            reseaux: ["ccca-btp"],
          };
        })
      );
    },
  };
};
