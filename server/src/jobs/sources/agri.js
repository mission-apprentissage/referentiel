const { compose, transformData } = require("oleoduc");
const { getOvhFileAsStream } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");

module.exports = (custom = {}) => {
  let name = "agri";

  return {
    name,
    async stream() {
      let input = custom.input || (await getOvhFileAsStream("cfas-reseaux/cfas-agri.csv", { storage: "mna-flux" }));

      return compose(
        input,
        parseCsv({ bom: true }),
        transformData((data) => {
          return {
            from: name,
            selector: data["siret"],
            uai_potentiels: [data["uai"]],
            reseaux: ["agri"],
          };
        })
      );
    },
  };
};
