const { compose, transformData } = require("oleoduc");
const { getFromStorage } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");

module.exports = (custom = {}) => {
  const name = "deca";

  return {
    name,
    async raw() {
      const input = custom.input || (await getFromStorage("liste_etab_SIA_Dares_v2.csv"));
      return compose(input, parseCsv());
    },
    async stream() {
      return compose(
        await this.raw(),
        transformData((data) => {
          return {
            from: name,
            selector: data.FORM_ETABSIRET,
            uai_potentiels: [data.FORM_ETABUAI_R],
          };
        })
      );
    },
  };
};
