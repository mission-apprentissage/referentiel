const { compose, transformData, oleoduc, accumulateData, writeData, filterData } = require("oleoduc");
const { parseCsv } = require("../../common/utils/csvUtils");
const { getOvhFileAsStream } = require("../../common/utils/ovhUtils");

async function downloadListePubliqueDesOrganismesDeFormation(options = {}) {
  //await getFileAsStream("https://www.monactiviteformation.emploi.gouv.fr/mon-activite-formation/public/listePubliqueOF?format=csv")
  let stream = options.input || (await getOvhFileAsStream("annuaire/public_ofs_latest.csv"));

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

function getSiret(data) {
  return `${data.siren}${data.siretEtablissementDeclarant}`;
}

module.exports = (custom = {}) => {
  let name = "datagouv";

  return {
    name,
    async loadOrganismeDeFormations() {
      let organismes = [];
      let stream = await downloadListePubliqueDesOrganismesDeFormation(custom);

      await oleoduc(
        stream,
        transformData((data) => {
          return {
            siret: getSiret(data),
          };
        }),
        accumulateData((acc, data) => [...acc, data.siret], { accumulator: [] }),
        writeData((acc) => (organismes = acc))
      );

      return organismes;
    },
    async referentiel() {
      let stream = await downloadListePubliqueDesOrganismesDeFormation(custom);

      return compose(
        stream,
        filterData(isQualiopi),
        transformData((data) => {
          return {
            from: name,
            siret: getSiret(data),
          };
        })
      );
    },
    async stream() {
      let stream = await downloadListePubliqueDesOrganismesDeFormation(custom);

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
