const { compose, transformData, mergeStreams, flattenArray } = require("oleoduc");
const { getFromStorage } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");

const SOURCE_NAME = "enseignement-catholique";
function sanitize(v) {
  return v?.replace(/ /g, "");
}

async function readCSV(input) {
  const stream = input || (await getFromStorage("enseignement-catholique.csv"));

  return compose(
    stream,
    parseCsv(),
    transformData((data) => {
      return {
        from: SOURCE_NAME,
        selector: sanitize(data.SIRET),
        reseaux: ["enseignement-catholique"],
        uai_potentiels: [data["N° UAI CFA"]],
      };
    })
  );
}

async function readCSVRelations(input) {
  const stream = input || (await getFromStorage("enseignement-catholique-relations.csv"));

  return compose(
    stream,
    parseCsv(),
    transformData((data) => {
      return [
        {
          from: SOURCE_NAME,
          selector: sanitize(data["SIRET CFA"]),
          reseaux: ["enseignement-catholique"],
          relations: [
            {
              type: "responsable->formateur",
              siret: sanitize(data["SIRET UFA"]),
              label: data["CFA"],
            },
          ],
        },
        {
          from: SOURCE_NAME,
          selector: sanitize(data["SIRET UFA"]),
          reseaux: ["enseignement-catholique"],
          uai_potentiels: [data["UAI CFA UFA"]],
          relations: [
            {
              type: "formateur->responsable",
              siret: sanitize(data["SIRET CFA"]),
              label: data["UFA"],
            },
          ],
        },
      ];
    }),
    flattenArray()
  );
}

module.exports = (custom = {}) => {
  return {
    name: SOURCE_NAME,
    async stream() {
      return mergeStreams([await readCSV(custom.input[0]), await readCSVRelations(custom.input[1])]);
    },
  };
};
