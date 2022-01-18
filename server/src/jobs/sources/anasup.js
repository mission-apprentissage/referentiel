const { compose, transformData } = require("oleoduc");
const { getFromStorage } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");

module.exports = (custom = {}) => {
  let name = "anasup";

  return {
    name,
    async stream() {
      let input = custom.input || (await getFromStorage("cfas-reseaux/cfas-anasup.csv", { storage: "mna-flux" }));

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
            selector: data["siret"],
            uai_potentiels: [data["uai"]],
            reseaux: ["anasup"],
          };
        })
      );
    },
  };
};
