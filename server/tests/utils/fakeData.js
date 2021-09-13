const { merge } = require("lodash");
const { getDatabase } = require("../../src/common/db/mongodb");

module.exports = {
  insertAcce: async (custom = {}) => {
    let db = await getDatabase();
    return db.collection("acce").insertOne(
      merge(
        {},
        {
          uai: "0111111Y",
          _search: {
            searchIndex: 1,
            searchParams: "action=search",
          },
          academie: "Paris",
          administration: {
            nature: "Institut médico-éducatif",
            niveau: "UAI célibataire",
          },
          adresse: "31 rue des lilas",
          dateOuverture: new Date("1965-09-07T00:00:00Z"),
          denominations: {
            sigle: "I.M.E.F",
            denomination_principale: "INSTITUT MEDICO-SOCIAL PUBLIC",
            patronyme: "LA FORMATION",
          },
          email: "contact@organisme.fr",
          etat: "Ouvert",
          fax: "0123456789",
          geojson: {
            type: "Feature",
            geometry: {
              coordinates: [2.3962138833385707, 48.87903731682897],
              type: "Point",
            },
          },
          localisation: {
            adresse: "25 rue des lilas",
            acheminement: "75019 Paris",
          },
          maj: new Date("2021-05-28T00:00:00Z"),
          nom: "Organisme de formation",
          rattachements: {
            fille: [],
            mere: [],
          },
          secteur: "Public",
          specificites: [],
          tel: "0123456789",
          tutelle: "ministère de la santé et de la solidarité nationale",
          zones: {
            agglomeration_urbaine: "PARIS",
            bassin_de_formation: "PARIS",
            canton: "PARIS",
            commune: "PARIS",
          },
        },
        custom
      )
    );
  },
};
