const { oleoduc, transformData } = require("oleoduc");
const csv = require("csv-parse");
const { getOvhFileAsStream } = require("../../common/utils/ovhUtils");

module.exports = (custom = {}) => {
  let name = "ymag";
  return {
    name,
    async stream() {
      let input =
        custom.input ||
        (await getOvhFileAsStream("cfas-clients-erps/referentielCfas_ymag.csv", { storage: "mna-flux" }));

      return oleoduc(
        input,
        csv({
          delimiter: ";",
          trim: true,
          columns: true,
        }),
        transformData((data) => {
          return {
            from: name,
            selector: data["siret"].replace(/ /g, ""),
            uais: [data["uai"]],
          };
        }),
        { promisify: false }
      );
    },
  };
};
