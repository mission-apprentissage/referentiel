const { compose, transformData, mergeStreams } = require("oleoduc");
const { getFromStorage } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");

function readCSV(stream) {
  return compose(
    stream,
    parseCsv({
      bom: true,
      skip_lines_with_error: true,
    }),
    transformData((data) => {
      return {
        from: "onisep",
        selector: data["n° SIRET"],
        uai_potentiels: [data["code UAI"]],
      };
    })
  );
}

async function defaultStream() {
  return mergeStreams([
    readCSV(await getFromStorage("ONISEP-ideo-structures_denseignement_secondaire.csv")),
    readCSV(await getFromStorage("ONISEP-ideo-structures_denseignement_superieur.csv")),
  ]);
}

module.exports = (custom = {}) => {
  const name = "onisep";

  return {
    name,
    async stream() {
      return custom.input ? readCSV(custom.input) : await defaultStream();
    },
  };
};
