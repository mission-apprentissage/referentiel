const { compose, transformData } = require("oleoduc");
const { getOvhFileAsStream } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");

module.exports = (custom = {}) => {
  let name = "deca";

  return {
    name,
    async stream() {
      let input = custom.input || (await getOvhFileAsStream("annuaire/liste_etab_SIA_Dares.csv"));

      return compose(
        input,
        parseCsv(),
        transformData((data) => {
          return {
            from: name,
            selector: data.FORM_ETABSIRET,
            uais: [data.FORM_ETABUAI_R],
          };
        })
      );
    },
  };
};
