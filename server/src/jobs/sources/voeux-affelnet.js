const { compose, transformData } = require("oleoduc");
const { getOvhFileAsStream } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");
const { optionnalItem } = require("../../common/utils/objectUtils");

module.exports = (custom = {}) => {
  let name = "voeux-affelnet";

  return {
    name,
    async stream() {
      let input =
        custom.input ||
        (await getOvhFileAsStream("annuaire/voeux-affelnet-export-cfas-confirmes-actives-2021-09-03.csv"));

      return compose(
        input,
        parseCsv(),
        transformData(({ uai, siret, email }) => {
          return {
            from: name,
            selector: { $or: [...optionnalItem("siret", siret), ...(uai ? [{ uai }, { "uais.uai": uai }] : [])] },
            contacts: [{ email, confirmé: true }],
          };
        })
      );
    },
  };
};
