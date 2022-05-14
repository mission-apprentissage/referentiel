const { compose, transformData } = require("oleoduc");
const { getFromStorage } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");
const { optionalItem } = require("../../common/utils/objectUtils");

module.exports = (custom = {}) => {
  const name = "voeux-affelnet";

  return {
    name,
    async stream() {
      const input =
        custom.input || (await getFromStorage("voeux-affelnet-export-cfas-confirmes-actives-2021-09-03.csv"));

      return compose(
        input,
        parseCsv(),
        transformData(({ uai, siret, email }) => {
          return {
            from: name,
            selector: {
              $or: [...optionalItem("siret", siret), ...optionalItem("uai", uai)],
            },
            contacts: [{ email, confirmé: true }],
          };
        })
      );
    },
  };
};
