const { compose, transformData } = require("oleoduc");
const { getOvhFileAsStream } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");

module.exports = (custom = {}) => {
  let name = "opcoep";

  return {
    name,
    async stream() {
      let input =
        custom.input ||
        (await getOvhFileAsStream(
          "annuaire/OPCO EP-20201202 OPCO EP - Jeunes sans contrat par CFA, région et formation au 26 nov.csv"
        ));

      return compose(
        input,
        parseCsv({
          delimiter: ";",
          trim: true,
          bom: true,
          columns: true,
        }),
        transformData((data) => {
          return {
            from: name,
            selector: data["SIRET CFA"],
            uai_potentiels: [data["N UAI CFA"]],
          };
        })
      );
    },
  };
};
