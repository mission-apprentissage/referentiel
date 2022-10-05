const { compose, transformData, filterData } = require("oleoduc");
const { getFromStorage } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");
const { isEmpty } = require("lodash");

module.exports = (custom = {}) => {
  const name = "voeux-affelnet";

  return {
    name,
    async stream() {
      const input = custom.input || (await getFromStorage("voeux-affelnet-export-cfas-2022-10-05.csv"));

      return compose(
        input,
        parseCsv(),
        filterData((data) => !isEmpty(data.siret) && data.dernier_email === "notification"),
        transformData(({ siret, email }) => {
          return {
            from: name,
            selector: siret,
            contacts: [{ email, confirmé: true }],
          };
        })
      );
    },
  };
};
