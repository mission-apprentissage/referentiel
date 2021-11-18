const { compose, transformData, filterData } = require("oleoduc");
const csv = require("csv-parse");
const { getOvhFileAsStream } = require("../../common/utils/ovhUtils");

module.exports = (custom = {}) => {
  let name = "ccca-btp";

  return {
    name,
    async stream() {
      let input = custom.input || (await getOvhFileAsStream("cfas-reseaux/cfas-ccca-btp.csv", { storage: "mna-flux" }));

      return compose(
        input,
        csv({
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
