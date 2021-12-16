const { compose, transformData } = require("oleoduc");
const csv = require("csv-parse");
const { getOvhFileAsStream } = require("../../common/utils/ovhUtils");

module.exports = (custom = {}) => {
  let name = "mfr";

  return {
    name,
    async stream() {
      let input = custom.input || (await getOvhFileAsStream("cfas-reseaux/cfas-mfr.csv", { storage: "mna-flux" }));

      return compose(
        input,
        csv({
          delimiter: ";",
          trim: true,
          bom: true,
          columns: true,
        }),
        transformData((data) => {
          let uais = [...new Set([data["uai"], data["uai_code_educnationale"]])].filter((u) => u);
          return {
            from: name,
            selector: {
              $or: [{ siret: data["siret"] }, { uai: { $in: uais } }],
            },
            uai_potentiels: uais,
            reseaux: ["mfr"],
          };
        })
      );
    },
  };
};
