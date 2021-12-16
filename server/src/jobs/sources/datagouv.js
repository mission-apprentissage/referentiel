const { compose, transformData, filterData } = require("oleoduc");
const { getFileAsStream } = require("../../common/utils/httpUtils");
const { parseCsv } = require("../../common/utils/csvUtils");

function downloadListePubliqueDesOrganismesDeFormation() {
  return getFileAsStream("https://www.monactiviteformation.emploi.gouv.fr/mon-activite-formation/public/getOFs");
}

module.exports = (custom = {}) => {
  let name = "datagouv";

  return {
    name,
    async stream() {
      let input = custom.input || (await downloadListePubliqueDesOrganismesDeFormation());

      return compose(
        input,
        parseCsv({
          columns: (header) => header.map((column) => column.replace(/ /g, "")),
        }),
        filterData((data) => data.cfa === "Oui"),
        transformData((data) => {
          return {
            from: name,
            selector: { siret: { $regex: new RegExp(`^${data.siren}`) } },
            data: {
              numero_declaration_activite: data.num_da,
            },
          };
        })
      );
    },
  };
};
