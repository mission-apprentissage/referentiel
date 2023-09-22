const { compose, transformData, flattenArray, filterData } = require("oleoduc");
const { decodeStream } = require("iconv-lite");
const { getFromStorage } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");

module.exports = (custom = {}) => {
  const name = "ideo2";

  return {
    name,
    async stream() {
      const input = custom.input || (await getFromStorage("ONISEP-Ideo2-T_Export_complet.csv"));
      const memory = [];

      return compose(
        input,
        decodeStream("iso-8859-1"),
        parseCsv({
          skip_lines_with_error: true,
        }),
        filterData((data) => {
          const key = `${data["SIRET_gestionnaire"]}_${data["SIRET_lieu_enseignement"]}`;
          if (memory.includes(key)) {
            return null;
          }
          memory.push(key);
          return data;
        }),
        transformData(async (data) => {
          const siretFormateur = data["SIRET_lieu_enseignement"];

          /* GAS, 22/9/2023: suppression des relations car
             le fichier ideo2 est trop ancien. À actualiser
             après le branchement à l'entrepôt Onisep */
          return [
            {
              from: name,
              selector: siretFormateur,
              uai_potentiels: [data["UAI_lieu_enseignement"]],
            },
          ];
        }),
        flattenArray()
      );
    },
  };
};
