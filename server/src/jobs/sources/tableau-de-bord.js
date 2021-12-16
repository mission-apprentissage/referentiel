const { compose, transformData } = require("oleoduc");
const { getOvhFileAsStream } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");

module.exports = (custom = {}) => {
  let name = "tableau-de-bord";

  return {
    name,
    async stream() {
      let input =
        custom.input ||
        (await getOvhFileAsStream("support/tdb_uaisSiretsCouples_1630597270816.csv", {
          storage: "mna-tableau-de-bord",
        }));

      return compose(
        input,
        parseCsv(),
        transformData(({ siret, uai }) => {
          return {
            from: name,
            selector: siret,
            uai_potentiels: [uai],
          };
        })
      );
    },
  };
};
