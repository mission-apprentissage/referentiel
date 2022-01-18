const { compose, transformData, flattenArray, filterData } = require("oleoduc");
const { isEmpty } = require("lodash");
const { decodeStream } = require("iconv-lite");
const { getFromStorage } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");

module.exports = (custom = {}) => {
  let name = "ideo2";

  return {
    name,
    async stream() {
      let input = custom.input || (await getFromStorage("ONISEP-Ideo2-T_Export_complet.csv"));
      let memory = [];

      return compose(
        input,
        decodeStream("iso-8859-1"),
        parseCsv({
          skip_lines_with_error: true,
        }),
        filterData((data) => {
          let key = `${data["SIRET_gestionnaire"]}_${data["SIRET_lieu_enseignement"]}`;
          if (memory.includes(key)) {
            return null;
          }
          memory.push(key);
          return data;
        }),
        transformData(async (data) => {
          let siretFormateur = data["SIRET_lieu_enseignement"];
          let siretGestionnaire = data["SIRET_gestionnaire"];
          let nomLieuEnseignement = data["nom_lieu_enseignement"];
          let cfaGestionnaire = data["CFA_gestionnaire"];

          return [
            {
              from: name,
              selector: siretGestionnaire,
              relations: [
                ...(isEmpty(siretFormateur)
                  ? []
                  : [
                      {
                        siret: siretFormateur,
                        type: "formateur",
                        ...(nomLieuEnseignement ? { label: nomLieuEnseignement } : {}),
                      },
                    ]),
              ],
            },
            {
              from: name,
              selector: siretFormateur,
              uai_potentiels: [data["UAI_lieu_enseignement"]],
              relations: [
                ...(isEmpty(siretGestionnaire)
                  ? []
                  : [
                      {
                        siret: siretGestionnaire,
                        type: "responsable",
                        ...(cfaGestionnaire ? { label: cfaGestionnaire } : {}),
                      },
                    ]),
              ],
            },
          ];
        }),
        flattenArray()
      );
    },
  };
};
