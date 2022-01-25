const { compose, transformData } = require("oleoduc");
const { dbCollection } = require("../../common/db/mongodb");

function isQualiopi(doc) {
  return doc.certifications.actionsDeFormationParApprentissage === true;
}

module.exports = () => {
  let name = "datagouv";

  return {
    name,
    async loadSirets() {
      let organismes = await dbCollection("datagouv")
        .aggregate([{ $group: { _id: "$siretEtablissementDeclarant" } }])
        .toArray();

      return organismes.map((o) => o._id);
    },
    async referentiel() {
      return compose(
        dbCollection("datagouv").find({ "certifications.actionsDeFormationParApprentissage": true }).stream(),
        transformData((doc) => {
          return {
            from: name,
            siret: doc.siretEtablissementDeclarant,
          };
        })
      );
    },
    async stream() {
      return compose(
        dbCollection("datagouv").find().stream(),
        transformData((doc) => {
          let nda = doc.numeroDeclarationActivite;

          return {
            from: name,
            selector: { siret: doc.siretEtablissementDeclarant },
            data: {
              ...(nda ? { numero_declaration_activite: nda } : {}),
              qualiopi: isQualiopi(doc),
            },
          };
        })
      );
    },
  };
};
