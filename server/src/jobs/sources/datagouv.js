const { compose, transformData, oleoduc, accumulateData, writeData, filterData } = require("oleoduc");
const { parseCsv } = require("../../common/utils/csvUtils");
const { getFromStorage } = require("../../common/utils/ovhUtils");

async function getListePubliqueDesOrganismesDeFormationAsStream(options = {}) {
  //await getFileAsStream("https://www.monactiviteformation.emploi.gouv.fr/mon-activite-formation/public/listePubliqueOF?format=csv")
  let stream = options.input || (await getFromStorage("public_ofs_latest.csv"));

  return compose(
    stream,
    parseCsv({
      columns: (header) => header.map((column) => column.replace(/\./g, "_")),
    })
  );
}

function isQualiopi(data) {
  return data["certifications_actionsDeFormationParApprentissage"] === "true";
}

module.exports = (custom = {}) => {
  let name = "datagouv";

  return {
    name,
    async loadOrganismeDeFormations() {
      let organismes = [];
      let stream = await getListePubliqueDesOrganismesDeFormationAsStream(custom);

      await oleoduc(
        stream,
        transformData((data) => {
          return {
            siret: data.siretEtablissementDeclarant,
          };
        }),
        accumulateData((acc, data) => [...acc, data.siret], { accumulator: [] }),
        writeData((acc) => (organismes = acc))
      );

      return organismes;
    },
    async referentiel() {
      let stream = await getListePubliqueDesOrganismesDeFormationAsStream(custom);

      return compose(
        stream,
        filterData(isQualiopi),
        transformData((data) => {
          const siret = data.siretEtablissementDeclarant;
          return {
            from: name,
            siret: siret,
          };
        })
      );
    },
    async stream() {
      let stream = await getListePubliqueDesOrganismesDeFormationAsStream(custom);

      return compose(
        stream,
        transformData((data) => {
          let nda = data.numeroDeclarationActivite;
          return {
            from: name,
            selector: { siret: { $regex: new RegExp(`^${data.siren}`) } },
            data: {
              ...(nda ? { numero_declaration_activite: nda } : {}),
              qualiopi: isQualiopi(data),
            },
          };
        })
      );
    },
  };
};
