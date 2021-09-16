const { merge } = require("lodash");
const { getCollection } = require("../../src/common/db/mongodb");
const faker = require("faker");

module.exports = {
  insertAnnuaireStats(custom) {
    return getCollection("annuaireStats").insertOne(
      merge(
        {},
        {
          created_at: new Date(),
          validation: {
            deca: {
              total: 14287,
              sirets: {
                total: 9168,
                valides: 4482,
                dupliqués: 3796,
                fermés: 814,
                inconnus: 74,
                absents: 5119,
                invalides: 2,
                erreurs: 0,
              },
              uais: {
                total: 14287,
                valides: 4757,
                dupliqués: 7497,
                absents: 0,
                invalides: 2033,
              },
            },
            catalogue: {
              total: 5679,
              sirets: {
                total: 5679,
                valides: 5253,
                dupliqués: 1,
                fermés: 406,
                inconnus: 4,
                absents: 0,
                invalides: 12,
                erreurs: 3,
              },
              uais: {
                total: 3921,
                valides: 3491,
                dupliqués: 388,
                absents: 1758,
                invalides: 42,
              },
            },
            ramsese: {
              total: 1629,
              sirets: {
                total: 1626,
                valides: 1521,
                dupliqués: 96,
                fermés: 7,
                inconnus: 1,
                absents: 3,
                invalides: 1,
                erreurs: 0,
              },
              uais: {
                total: 1629,
                valides: 1629,
                dupliqués: 0,
                absents: 0,
                invalides: 0,
              },
            },
            sifa: {
              total: 2141,
              sirets: {
                total: 2025,
                valides: 1852,
                dupliqués: 38,
                fermés: 114,
                inconnus: 7,
                absents: 116,
                invalides: 14,
                erreurs: 0,
              },
              uais: {
                total: 2141,
                valides: 2141,
                dupliqués: 0,
                absents: 0,
                invalides: 0,
              },
            },
          },
          matrix: {
            datagouv: {
              total: 2434,
              deca: 0,
              etablissements: 432,
              ramsese: 0,
              sifa: 0,
            },
            deca: {
              total: 14287,
              etablissements: 2013,
              ramsese: 394,
              sifa: 1669,
            },
            etablissements: {
              total: 5679,
              deca: 2013,
              ramsese: 513,
              sifa: 1081,
            },
            ramsese: {
              total: 1629,
              deca: 394,
              etablissements: 513,
              sifa: 0,
            },
            sifa: {
              total: 2141,
              deca: 1669,
              etablissements: 1081,
              ramsese: 0,
            },
          },
        },
        custom
      )
    );
  },
  insertAnnuaire(custom) {
    return getCollection("annuaire").insertOne(
      merge(
        {},
        {
          siret: faker.helpers.replaceSymbols("#########00015"),
          raison_sociale: faker.company.companyName(),
          uais: [],
          contacts: [],
          relations: [],
          lieux_de_formation: [],
          reseaux: [],
          diplomes: [],
          certifications: [],
          referentiels: ["test"],
          siege_social: true,
          statut: "actif",
          conformite_reglementaire: {
            conventionne: true,
          },
          adresse: {
            geojson: {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [2.396444, 48.879706],
              },
              properties: {
                score: 0.88,
              },
            },
            label: "31 rue des lilas Paris 75019",
            code_postal: "75001",
            code_insee: "75000",
            localite: "PARIS",
            region: {
              code: "11",
              nom: "Île-de-France",
            },
            academie: {
              code: "01",
              nom: "Paris",
            },
          },
          _meta: {
            anomalies: [],
            created_at: new Date(),
          },
        },
        custom
      )
    );
  },
  insertEtablissement(custom) {
    return getCollection("etablissements").insertOne(
      merge(
        {},
        {
          siret: faker.helpers.replaceSymbols("#########00015"),

          uai: "0010856A",
          tags: ["2020", "2021"],
        },
        custom
      )
    );
  },
  insertCFD(custom) {
    return getCollection("cfd").insertOne(
      merge(
        {},
        {
          FORMATION_DIPLOME: faker.helpers.replaceSymbols("########"),
          NIVEAU_FORMATION_DIPLOME: faker.helpers.replaceSymbols("##?"),
          LIBELLE_COURT: "FORMATION",
        },
        custom
      )
    );
  },
  insertAcce: async (custom = {}) => {
    return getCollection("acce").insertOne(
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
