const { compose, transformData } = require("oleoduc");
const csv = require("csv-parse");
const { decodeStream } = require("iconv-lite");
const { getOvhFileAsStream } = require("../../common/utils/ovhUtils");

module.exports = (custom = {}) => {
  let name = "gesti";
  return {
    name,
    async stream() {
      let input =
        custom.input ||
        (await getOvhFileAsStream("cfas-clients-erps/referentielCfas_gesti.csv", { storage: "mna-flux" }));

      return compose(
        input,
        decodeStream("iso-8859-1"),
        csv({
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
