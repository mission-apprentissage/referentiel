const { merge } = require("lodash");
const { dbCollection } = require("../../src/common/db/mongodb");
// eslint-disable-next-line node/no-unpublished-require
const { helpers, company } = require("@faker-js/faker").faker;

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
            siret: helpers.replaceSymbols("#########00015"),
            raison_sociale: company.companyName(),
            nature: "inconnue",
            uai_potentiels: [],
            contacts: [],
            relations: [],
            lieux_de_formation: [],
            reseaux: [],
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
          FORMATION_DIPLOME: helpers.replaceSymbols("########"),
          NIVEAU_FORMATION_DIPLOME: helpers.replaceSymbols("##?"),
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
          academie: "01",
          academie_libe: "Paris",
          adresse_uai: "36 rue des lilas",
          appariement: "Parfaite",
          appariement_complement: "",
          appellation_officielle: "Lycée professionnel",
          boite_postale_uai: "",
          categorie_financiere: "4",
          categorie_financiere_libe: "4",
          categorie_juridique: "200",
          categorie_juridique_libe: "Etablissement public local d'enseignement (EPLE)",
          code_postal_uai: "75001",
          commune: "1000",
          commune_libe: "Paris",
          contrat_etablissement: "99",
          contrat_etablissement_libe: "Sans objet",
          coordonnee_x: "881947.9",
          coordonnee_y: "6544401.7",
          date_derniere_mise_a_jour: "23/11/2021",
          date_fermeture: "",
          date_geolocalisation: "18/11/2021",
          date_ouverture: "01/05/1965",
          denomination_principale: "LP LYCEE DES METIERS",
          departement_insee_3: "001",
          departement_insee_3_libe: "Paris",
          etat_etablissement: "1",
          etat_etablissement_libe: "Ouvert",
          etat_sirad_uai: "1",
          hebergement_etablissement: "22",
          hebergement_etablissement_libe: "Avec internat et demi-pension",
          lieu_dit_uai: "",
          localisation: "Numéro de rue",
          localisation_complement: "",
          localite_acheminement_uai: "PARIS",
          mel_uai: "contact@formation.fr",
          mention_distribution: "",
          ministere_tutelle: "06",
          ministere_tutelle_libe: "ministére de l'éducation nationale",
          nature_uai: "320",
          nature_uai_libe: "Lycée professionnel",
          niveau_uai: "1",
          niveau_uai_libe: "UAI célibataire",
          numero_finess_uai: "",
          numero_siren_siret_uai: "11111111100006",
          numero_telecopieur_uai: "01 23 45 67 89",
          numero_telephone_uai: "01 23 45 67 89",
          numero_uai: "0751234J",
          patronyme_uai: "Centre de formation",
          pays: "100",
          pays_etranger_acheminement: "",
          pays_libe: "France",
          secteur_public_prive: "PU",
          secteur_public_prive_libe: "Public",
          sigle_uai: "LP LYC METIER",
          site_web: "https://formation.fr/",
          situation_comptable: "2",
          situation_comptable_libe: "Siége de l'agence comptable",
          source: "IGN",
          tutelle_2: "",
          tutelle_2_libe: "",
          type_uai: "LP",
          type_uai_libe: "Lycées professionnels",
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
          siret: helpers.replaceSymbols("#########00015"),
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
          numeroDeclarationActivite: helpers.replaceSymbols("###########"),
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
