const { compose, transformData, filterData } = require("oleoduc");
const csv = require("csv-parse");
const { getOvhFileAsStream } = require("../../common/utils/ovhUtils");

module.exports = (custom = {}) => {
  let name = "cci-france";

  return {
    name,
    async stream() {
      let input =
        custom.input || (await getOvhFileAsStream("cfas-reseaux/cfas-cci-france.csv", { storage: "mna-flux" }));

      return compose(
        input,
        csv({
          delimiter: ";",
          trim: true,
          bom: true,
          columns: true,
        }),
        filterData((data) => data.uai),
        transformData((data) => {
          let uai = data["uai"];

          return {
            from: name,
            selector: { $or: [{ uai }, { "uais.uai": uai }] },
            reseaux: ["cci-france"],
          };
        })
      );
    },
  };
};
