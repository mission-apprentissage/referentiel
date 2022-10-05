const { compose, transformData } = require("oleoduc");
const { parseCsv } = require("../../common/utils/csvUtils");
const { fetchStream } = require("../../common/utils/httpUtils.js");

module.exports = (custom = {}) => {
  const name = "refea";

  return {
    name,
    async stream() {
      const input =
        custom.input ||
        (await fetchStream(
          "http://enseignement-agricole.opendatasoft.com/explore/dataset/liste-uai-avec-coordonnees/download?format=csv&timezone=Europe/Berlin&use_labels_for_header=false"
        ));

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
            selector: data["uai_code_siret"],
            uai_potentiels: [data["uai_code_educnationale"]],
          };
        })
      );
    },
  };
};
