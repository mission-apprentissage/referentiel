const { merge } = require("lodash");
const { dbCollection } = require("../../src/common/db/mongodb");
const faker = require("faker");

module.exports = {
  insertStats(custom) {
    return dbCollection("stats").insertOne(
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
              organismes: 432,
              ramsese: 0,
              sifa: 0,
            },
            deca: {
              total: 14287,
              organismes: 2013,
              ramsese: 394,
              sifa: 1669,
            },
            organismes: {
              total: 5679,
              deca: 2013,
              ramsese: 513,
              sifa: 1081,
            },
            ramsese: {
              total: 1629,
              deca: 394,
              organismes: 513,
              sifa: 0,
            },
            sifa: {
              total: 2141,
              deca: 1669,
              organismes: 1081,
              ramsese: 0,
            },
          },
        },
        custom
      )
    );
  },
  insertOrganisme(custom, map = (v) => v) {
    return dbCollection("organismes").insertOne(
      map(
        merge(
          {},
          {
            siret: faker.helpers.replaceSymbols("#########00015"),
            raison_sociale: faker.company.companyName(),
            uai_potentiels: [],
            contacts: [],
            relations: [],
            lieux_de_formation: [],
            reseaux: [],
            natures: [],
            diplomes: [],
            certifications: [],
            referentiels: ["test"],
            siege_social: true,
            etat_administratif: "actif",
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
              departement: {
                code: "75",
                nom: "Paris",
              },
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
              date_import: new Date(),
            },
          },
          custom
        )
      )
    );
  },
  insertCFD(custom) {
    return dbCollection("cfd").insertOne(
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
    return dbCollection("acce").insertOne(
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
  insertModification(custom) {
    return dbCollection("modifications").insertOne(
      merge(
        {},
        {
          siret: faker.helpers.replaceSymbols("#########00015"),
          date: new Date(),
          auteur: "test",
          original: {},
          changements: {
            uai: "0751234V",
          },
        },
        custom
      )
    );
  },
  insertDatagouv: (custom = {}) => {
    return dbCollection("datagouv").insertOne(
      merge(
        {},
        {
          adressePhysiqueOrganismeFormation: {
            codePostal: "75001",
            codeRegion: "11",
            ville: "PARIS",
            voie: "RUE DES LILAS",
          },
          certifications: {
            VAE: "false",
            actionsDeFormation: true,
            actionsDeFormationParApprentissage: false,
            bilansDeCompetences: false,
          },
          denomination: "OF",
          informationsDeclarees: {
            dateDerniereDeclaration: new Date("2020-12-02T23:00:00.000Z"),
            debutExercice: new Date("2020-10-31T23:00:00.000Z"),
            effectifFormateurs: 0,
            finExercice: new Date("2021-12-30T23:00:00.000Z"),
            nbStagiaires: 3,
            nbStagiairesConfiesParUnAutreOF: 3,
            specialitesDeFormation: {
              codeSpecialite1: "312",
              libelleSpecialite1: "Commerce, vente",
            },
          },
          numeroDeclarationActivite: faker.helpers.replaceSymbols("###########"),
          numerosDeclarationActivitePrecedent: "12345678900",
          organismeEtrangerRepresente: {},
          siren: "111111111",
          siretEtablissementDeclarant: "1111111110001",
        },
        custom
      )
    );
  },
  insertCommunes: (custom = {}) => {
    return dbCollection("communes").insertOne(
      merge(
        {},
        {
          _id: "11129",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [2.2007059510300557, 42.950340977698936],
                [2.1962711908151356, 42.9445451370596],
                [2.19721475681831, 42.940810039758695],
                [2.1998567416271984, 42.937718924751046],
                [2.199196245424976, 42.934370216826096],
                [2.1957994078135483, 42.9296691460853],
                [2.1961768342148185, 42.92374450898732],
                [2.2100472544614824, 42.926191641701706],
                [2.217123999485291, 42.92870317264541],
                [2.21938855789291, 42.92664242930699],
                [2.2198603408944972, 42.92065339397967],
                [2.2218418295011633, 42.91827065949461],
                [2.2257104501141782, 42.915501535633595],
                [2.2299564971284633, 42.91112245603943],
                [2.2384485911570335, 42.909061712700996],
                [2.2442987003767154, 42.912410420625946],
                [2.245147909779573, 42.91459996042303],
                [2.2439212739754453, 42.91685389844944],
                [2.245525336180842, 42.922649739088776],
                [2.2421284985694143, 42.92702881868294],
                [2.241562358967509, 42.92902516379205],
                [2.2423172117700494, 42.9326314646343],
                [2.2369388855519547, 42.93353303984486],
                [2.235051753545606, 42.9361089690179],
                [2.2367501723513197, 42.93836290704431],
                [2.235146110145923, 42.93926448225487],
                [2.23156055933386, 42.938234110585654],
                [2.2266540161173527, 42.94422314591297],
                [2.218822418291005, 42.94860222550714],
                [2.2136328052735452, 42.95027657946961],
                [2.204951998044341, 42.948731021965784],
                [2.2007059510300557, 42.950340977698936],
              ],
            ],
          },
          properties: {
            codgeo: "11129",
            libgeo: "Espéraza",
            dep: "11",
            reg: "76",
            xcl2154: 636317,
            ycl2154: 6204292,
          },
          type: "Feature",
        },
        custom
      )
    );
  },
};
