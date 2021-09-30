const { compose, transformData } = require("oleoduc");
const csv = require("csv-parse");
const { getOvhFileAsStream } = require("../../common/utils/ovhUtils");

module.exports = (custom = {}) => {
  let name = "promotrans";

  return {
    name,
    async stream() {
      let input =
        custom.input || (await getOvhFileAsStream("cfas-reseaux/cfas-promotrans.csv", { storage: "mna-flux" }));

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
            selector: data["siret"],
            uais: [data["uai"]],
            reseaux: ["promotrans"],
          };
        })
      );
    },
  };
};
