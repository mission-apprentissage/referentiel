const { oleoduc, transformData, mergeStreams } = require("oleoduc");
const { getOvhFileAsStream } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");

function readCSV(stream) {
  return oleoduc(
    stream,
    parseCsv({
      bom: true,
      skip_lines_with_error: true,
    }),
    transformData((data) => {
      return {
        from: "onisep",
        selector: data["n° SIRET"],
        uais: [data["code UAI"]],
      };
    }),
    { promisify: false }
  );
}

async function defaultStream() {
  return mergeStreams([
    readCSV(await getOvhFileAsStream("annuaire/ONISEP-ideo-structures_denseignement_secondaire.csv")),
    readCSV(await getOvhFileAsStream("annuaire/ONISEP-ideo-structures_denseignement_superieur.csv")),
  ]);
}

module.exports = (custom = {}) => {
  let name = "onisep";

  return {
    name,
    async stream() {
      return custom.input ? readCSV(custom.input) : await defaultStream();
    },
  };
};
