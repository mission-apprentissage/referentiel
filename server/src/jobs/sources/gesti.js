const { compose, transformData } = require("oleoduc");
const { decodeStream } = require("iconv-lite");
const { getFromStorage } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");

module.exports = (custom = {}) => {
  let name = "gesti";
  return {
    name,
    async stream() {
      let input =
        custom.input || (await getFromStorage("cfas-clients-erps/referentielCfas_gesti.csv", { storage: "mna-flux" }));

      return compose(
        input,
        decodeStream("iso-8859-1"),
        parseCsv({
          delimiter: ";",
          trim: true,
          columns: true,
        }),
        transformData((data) => {
          return {
            from: name,
            selector: data["siret"],
            uai_potentiels: [data["uai_code_educnationale"]],
          };
        })
      );
    },
  };
};
