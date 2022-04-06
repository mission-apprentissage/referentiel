const { compose, transformData, filterData, flattenArray } = require("oleoduc");
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
        filterData((doc) => doc.numeroDeclarationActivite),
        transformData(async (doc) => {
          let siret = doc.siretEtablissementDeclarant;
          let qualiopi = isQualiopi(doc);

          let array = [
            {
              from: name,
              selector: {
                siret,
              },
              data: {
                numero_declaration_activite: doc.numeroDeclarationActivite,
                qualiopi,
              },
            },
          ];

          if (qualiopi) {
            let asSameSirenRegexp = new RegExp(`^${siret.substring(0, 9)}.*`);
            let ignored = await dbCollection("datagouv")
              .find(
                { siretEtablissementDeclarant: asSameSirenRegexp },
                { projection: { siretEtablissementDeclarant: 1 } }
              )
              .toArray();

            array.push({
              from: name,
              selector: {
                $and: [
                  { siret: asSameSirenRegexp },
                  { siret: { $nin: ignored.map((d) => d.siretEtablissementDeclarant) } },
                ],
              },
              data: {
                numero_declaration_activite: doc.numeroDeclarationActivite,
                qualiopi,
              },
            });
          }

          return array;
        }),
        flattenArray()
      );
    },
  };
};
