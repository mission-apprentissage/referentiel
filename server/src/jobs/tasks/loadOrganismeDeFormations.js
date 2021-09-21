const { oleoduc, accumulateData, writeData, filterData, transformData } = require("oleoduc");
const { parseCsv } = require("../../common/utils/csvUtils");
const { getFileAsStream } = require("../../common/utils/httpUtils");

function downloadFromDatagouv() {
  return getFileAsStream("https://www.monactiviteformation.emploi.gouv.fr/mon-activite-formation/public/getOFs");
}

async function loadOrganismeDeFormations(options = {}) {
  let organismes = [];
  let input = options.input || (await downloadFromDatagouv());

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
}

module.exports = loadOrganismeDeFormations;
