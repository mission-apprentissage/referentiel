const { oleoduc, filterData, transformData } = require("oleoduc");
const { getFileAsStream } = require("../../common/utils/httpUtils");
const { parseCsv } = require("../../common/utils/csvUtils");

function downloadFromDatagouv() {
  return getFileAsStream("https://www.monactiviteformation.emploi.gouv.fr/mon-activite-formation/public/getOFs");
}
module.exports = (custom = {}) => {
  let name = "datagouv";

  return {
    name,
    async stream() {
      let input = custom.input || (await downloadFromDatagouv());

      return oleoduc(
        input,
        parseCsv({
          columns: (header) => header.map((column) => column.replace(/ /g, "")),
        }),
        filterData((data) => data.cfa === "Oui"),
        transformData((data) => {
          return {
            from: name,
            siret: `${data.siren}${data.num_etablissement}`,
          };
        }),
        { promisify: false }
      );
    },
    asSource() {
      return {
        name,
        stream: async () => {
          let input = await this.stream();

          return oleoduc(
            input,
            transformData((data) => {
              return {
                from: name,
                selector: data.siret,
              };
            }),
            { promisify: false }
          );
        },
      };
    },
  };
};
