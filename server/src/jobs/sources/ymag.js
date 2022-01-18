const { compose, transformData } = require("oleoduc");
const { getFromStorage } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");

module.exports = (custom = {}) => {
  let name = "ymag";
  return {
    name,
    async stream() {
      let input =
        custom.input || (await getFromStorage("cfas-clients-erps/referentielCfas_ymag.csv", { storage: "mna-flux" }));

      return compose(
        input,
        parseCsv({
          delimiter: ";",
          trim: true,
          columns: true,
        }),
        transformData((data) => {
          return {
            from: name,
            selector: data["siret"]?.replace(/ /g, ""),
            uai_potentiels: [data["uai"]],
          };
        })
      );
    },
  };
};
