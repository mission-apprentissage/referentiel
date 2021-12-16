const { compose, transformData, filterData, oleoduc, accumulateData, writeData } = require("oleoduc");
const { parseCsv } = require("../../common/utils/csvUtils");
const { getOvhFileAsStream } = require("../../common/utils/ovhUtils");

function downloadListePubliqueDesOrganismesDeFormation() {
  //getFileAsStream("https://www.monactiviteformation.emploi.gouv.fr/mon-activite-formation/public/getOFs");
  return getOvhFileAsStream("annuaire/20211216_public_ofs.csv");
}

module.exports = (custom = {}) => {
  let name = "datagouv";

  return {
    name,
    async loadOrganismeDeFormations() {
      let organismes = [];
      let input = custom.input || (await downloadListePubliqueDesOrganismesDeFormation());

      await oleoduc(
        input,
        parseCsv({
          columns: (header) => header.map((column) => column.replace(/ /g, "")),
        }),
        filterData((data) => data.cfa === "Oui"),
        transformData((data) => {
          return {
            siret: `${data.siren}${data.num_etablissement}`,
          };
        }),
        accumulateData((acc, data) => [...acc, data.siret], { accumulator: [] }),
        writeData((acc) => (organismes = acc))
      );

      return organismes;
    },
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
