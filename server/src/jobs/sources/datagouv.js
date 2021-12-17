const { compose, transformData, oleoduc, accumulateData, writeData } = require("oleoduc");
const { parseCsv } = require("../../common/utils/csvUtils");
const { getFileAsStream } = require("../../common/utils/httpUtils");

async function downloadListePubliqueDesOrganismesDeFormation(options = {}) {
  let stream =
    options.input ||
    (await getFileAsStream(
      "https://www.monactiviteformation.emploi.gouv.fr/mon-activite-formation/public/listePubliqueOF?format=csv"
    ));

  return compose(
    stream,
    parseCsv({
      columns: (header) => header.map((column) => column.replace(/\./g, "_")),
    })
  );
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
            siret: `${data.siren}${data.siretEtablissementDeclarant}`,
          };
        }),
        accumulateData((acc, data) => [...acc, data.siret], { accumulator: [] }),
        writeData((acc) => (organismes = acc))
      );

      return organismes;
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
              qualiopi: data["certifications_actionsDeFormationParApprentissage"] === "true",
            },
          };
        })
      );
    },
  };
};
