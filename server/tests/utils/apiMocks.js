const path = require("path");
const { readFileSync } = require("fs");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter"); // eslint-disable-line node/no-unpublished-require
const AcceApi = require("../../src/common/apis/AcceApi");
const { merge, omit } = require("lodash");
const CatalogueApi = require("../../src/common/apis/CatalogueApi");
const TcoApi = require("../../src/common/apis/TcoApi");
const GeoAdresseApi = require("../../src/common/apis/GeoAdresseApi");
const SireneApi = require("../../src/common/apis/SireneApi");
const nock = require("nock"); // eslint-disable-line node/no-unpublished-require

function debug(instance) {
  instance.interceptors.request.use((request) => {
    console.log("Starting Request", JSON.stringify(request, null, 2));
    return request;
  });
}

function createAxios(Api, responses, callback, options) {
  let instance = axios.create(options);
  let mock = new MockAdapter(instance);
  callback(mock, responses);
  return new Api({ axios: instance });
}

module.exports = {
  mockTcoApi(callback) {
    let responses = {
      etablissements(custom) {
        return (
          custom ||
          `{"_id":"5e8df8d120ff3b216126808a","siege_social":true,"etablissement_siege_siret":"11111111100006","siret":"11111111100006","siren":"111111111","naf_code":"9411Z","naf_libelle":"Activités des organisations patronales et consulaires","date_creation":"1970-01-15T20:16:40.800Z","date_mise_a_jour":"1970-01-19T15:50:56.983Z","diffusable_commercialement":true,"enseigne":"CMA","adresse":"RUE DE LA FORMATION","numero_voie":"4","type_voie":"AV","nom_voie":"DU GENERAL LECLERC","complement_adresse":"Paris","code_postal":"75001","num_departement":"75","nom_departement":"Paris","localite":"PARIS","code_insee_localite":"7001","cedex":null,"date_fermeture":"2020-12-30T23:00:00.000Z","ferme":true,"region_implantation_code":"11","region_implantation_nom":"Île-de-France","commune_implantation_code":"75001","commune_implantation_nom":"Paris","pays_implantation_code":"FR","pays_implantation_nom":"FRANCE","num_academie":1,"nom_academie":"Paris","uai":"0751111A","uais_potentiels":[],"info_depp":1,"info_dgefp":1,"info_datagouv_ofs":1,"info_datadock":2,"info_depp_info":"Ok","info_dgefp_info":"Ok siren","info_datagouv_ofs_info":"Ok","info_datadock_info":"Ok","computed_type":"CFA","computed_declare_prefecture":"OUI","computed_conventionne":"OUI","computed_info_datadock":"datadocké","api_entreprise_reference":true,"parcoursup_a_charger":true,"affelnet_a_charger":true,"entreprise_siren":"111111111","entreprise_procedure_collective":false,"entreprise_enseigne":"CMA","entreprise_numero_tva_intracommunautaire":"FR17111111111","entreprise_code_effectif_entreprise":"31","entreprise_forme_juridique_code":"7381","entreprise_forme_juridique":"Organisme consulaire","entreprise_raison_sociale":"CHAMBRE DE METIERS ET DE L'ARTISANAT DE LA SEINE ET MARNE","entreprise_nom_commercial":"","entreprise_capital_social":null,"entreprise_date_creation":"1970-01-15T20:16:40.800Z","entreprise_date_radiation":null,"entreprise_naf_code":"9411Z","entreprise_naf_libelle":"Activités des organisations patronales et consulaires","entreprise_date_fermeture":"1970-01-19T15:02:49.200Z","entreprise_ferme":true,"entreprise_siret_siege_social":"13001301400019","entreprise_nom":null,"entreprise_prenom":null,"entreprise_categorie":"PME","formations_attachees":true,"formations_ids":["5e8df94920ff3b2161268944"],"formations_uais":["0751112B"],"formations_n3":true,"formations_n4":true,"formations_n5":true,"formations_n6":true,"formations_n7":false,"ds_id_dossier":"1342611","ds_questions_siren":"130013014","ds_questions_nom":"Henru","ds_questions_email":"robert@formation.fr","ds_questions_uai":"0751111A","ds_questions_has_agrement_cfa":"true","ds_questions_has_certificaton_2015":"true","ds_questions_has_ask_for_certificaton":"false","ds_questions_ask_for_certificaton_date":null,"ds_questions_declaration_code":null,"ds_questions_has_2020_training":"true","catalogue_published":true,"published":false,"updates_history":[],"update_error":"error: Siret non trouvé.","tags":["2020","2021"],"rco_uai":"0751111A","rco_adresse":null,"rco_code_postal":"75001","rco_code_insee_localite":"77288","created_at":"2020-02-29T17:32:22.497Z","last_update_at":"2021-09-12T01:03:30.593Z","__v":0,"entreprise_tranche_effectif_salarie":{"de":200,"a":249,"code":"31","date_reference":"2018","intitule":"200 à 249 salariés"},"etablissement_siege_id":null,"tranche_effectif_salarie":{"de":50,"a":99,"code":"21","date_reference":"2018","intitule":"50 à 99 salariés"},"geo_coordonnees":"48.52,2.6528","rco_geo_coordonnees":null,"onisep_code_postal":null,"onisep_nom":null,"onisep_url":null,"idcc":null,"info_qualiopi":0,"info_qualiopi_info":"NON","opco_nom":null,"opco_siren":null,"nda":"1177P001111"}\n`
        );
      },
    };

    callback(nock(TcoApi.baseApiUrl), responses);
  },
  getMockedCatalogueApi(callback, options = {}) {
    let instance = axios.create(options);
    options.debug && debug(instance);
    let responses = {
      formations(custom = {}) {
        return merge(
          {},
          {
            formations: [
              {
                _id: "5fc6166c712d48a9881333ac",
                etablissement_gestionnaire_id: "5e8df8a420ff3b2161267c58",
                etablissement_gestionnaire_siret: "11111111100006",
                etablissement_gestionnaire_enseigne: null,
                etablissement_gestionnaire_uai: "1111111X",
                etablissement_gestionnaire_type: "CFA",
                etablissement_gestionnaire_conventionne: "OUI",
                etablissement_gestionnaire_declare_prefecture: "OUI",
                etablissement_gestionnaire_datadock: "datadocké",
                etablissement_gestionnaire_published: true,
                etablissement_gestionnaire_catalogue_published: true,
                etablissement_gestionnaire_adresse: "31 rue des lilas",
                etablissement_gestionnaire_code_postal: "75019",
                etablissement_gestionnaire_code_commune_insee: "75000",
                etablissement_gestionnaire_localite: "Paris",
                etablissement_gestionnaire_complement_adresse: "LYCEE",
                etablissement_gestionnaire_cedex: null,
                etablissement_gestionnaire_entreprise_raison_sociale: "Centre de formation",
                rncp_etablissement_gestionnaire_habilite: false,
                etablissement_gestionnaire_region: "Paris",
                etablissement_gestionnaire_num_departement: "75",
                etablissement_gestionnaire_nom_departement: "Paris",
                etablissement_gestionnaire_nom_academie: "Paris",
                etablissement_gestionnaire_num_academie: "01",
                etablissement_gestionnaire_siren: "483986063",
                etablissement_formateur_id: "5e8df8a420ff3b2161267c58",
                etablissement_formateur_siret: "22222222200002",
                etablissement_formateur_enseigne: null,
                etablissement_formateur_uai: "1111111X",
                etablissement_formateur_type: "CFA",
                etablissement_formateur_conventionne: "OUI",
                etablissement_formateur_declare_prefecture: "OUI",
                etablissement_formateur_datadock: "datadocké",
                etablissement_formateur_published: true,
                etablissement_formateur_catalogue_published: true,
                etablissement_formateur_adresse: "31 rue des lilas",
                etablissement_formateur_code_postal: "75019",
                etablissement_formateur_code_commune_insee: "75000",
                etablissement_formateur_localite: "paris",
                etablissement_formateur_complement_adresse: "LYCEE",
                etablissement_formateur_cedex: null,
                etablissement_formateur_entreprise_raison_sociale: "Centre de formation",
                rncp_etablissement_formateur_habilite: false,
                etablissement_formateur_region: "Paris",
                etablissement_formateur_num_departement: "75",
                etablissement_formateur_nom_departement: "Paris",
                etablissement_formateur_nom_academie: "Paris",
                etablissement_formateur_num_academie: "01",
                etablissement_formateur_siren: "111111111",
                etablissement_reference: "gestionnaire",
                etablissement_reference_type: "CFA",
                etablissement_reference_conventionne: "OUI",
                etablissement_reference_declare_prefecture: "OUI",
                etablissement_reference_datadock: "datadocké",
                etablissement_reference_published: true,
                etablissement_reference_catalogue_published: true,
                cfd: "40030001",
                cfd_specialite: null,
                mef_10_code: null,
                nom_academie: "Paris",
                num_academie: "01",
                code_postal: "75019",
                code_commune_insee: "75000",
                num_departement: "75",
                nom_departement: "Paris",
                region: "Paris",
                localite: "Paris",
                uai_formation: null,
                nom: null,
                intitule_long: "GESTION-ADMINISTRATION (BAC PRO)",
                intitule_court: "GESTION-ADMINISTRATION",
                diplome: "BAC PROFESSIONNEL",
                niveau: "4 (Bac...)",
                onisep_url: "http://www.onisep.fr/http/redirection/formation/identifiant/28226",
                rncp_code: "RNCP34606",
                rncp_intitule: "Assistance gestion des organisations et de leurs activités",
                rncp_eligible_apprentissage: true,
                rncp_details: {
                  date_fin_validite_enregistrement: "8/31/25",
                  active_inactive: "ACTIVE",
                  etat_fiche_rncp: "Publiée",
                  niveau_europe: "niveau4",
                  code_type_certif: "BAC PRO",
                  type_certif: "Baccalauréat professionnel",
                  ancienne_fiche: ["RNCP14695"],
                  nouvelle_fiche: [],
                  demande: 0,
                  certificateurs: [],
                  nsf_code: "324",
                  nsf_libelle: "Secrétariat, bureautique",
                  romes: [
                    {
                      etat_fiche: "",
                      rome: "D1401",
                      libelle: "Assistanat commercial",
                    },
                    {
                      etat_fiche: "",
                      rome: "M1501",
                      libelle: "Assistanat en ressources humaines",
                    },
                    {
                      etat_fiche: "",
                      rome: "M1607",
                      libelle: "Secrétariat",
                    },
                    {
                      etat_fiche: "",
                      rome: "M1203",
                      libelle: "Comptabilité",
                    },
                  ],
                  blocs_competences: [
                    {
                      numero_bloc: "RNCP34606BC01",
                      intitule: "Organiser et suivre l'activité de production (de biens ou de services)",
                    },
                    {
                      numero_bloc: "RNCP34606BC02",
                      intitule: "Gérer des relations avec les clients, les usagers et les adhérents",
                    },
                    {
                      numero_bloc: "RNCP34606BC03",
                      intitule: "Administrer le personnel",
                    },
                    {
                      numero_bloc: "RNCP34606BC04",
                      intitule: "Prévention-santé-environnement",
                    },
                    {
                      numero_bloc: "RNCP34606BC05",
                      intitule: "Économie-droit",
                    },
                    {
                      numero_bloc: "RNCP34606BC06",
                      intitule: "Mathématiques",
                    },
                    {
                      numero_bloc: "RNCP34606BC07",
                      intitule: "Langues vivantes 1",
                    },
                    {
                      numero_bloc: "RNCP34606BC08",
                      intitule: "Langues vivantes 2",
                    },
                    {
                      numero_bloc: "RNCP34606BC09",
                      intitule: "Français",
                    },
                    {
                      numero_bloc: "RNCP34606BC10",
                      intitule: "Histoire-géographie et éducation civique",
                    },
                    {
                      numero_bloc: "RNCP34606BC11",
                      intitule: "Arts appliqués et cultures artistiques",
                    },
                    {
                      numero_bloc: "RNCP34606BC12",
                      intitule: "Éducation physique et sportive",
                    },
                    {
                      numero_bloc: "RNCP34606BC13",
                      intitule: "Langues vivantes (bloc facultatif)",
                    },
                    {
                      numero_bloc: "RNCP34606BC14",
                      intitule: "Mobilité (bloc facultatif)",
                    },
                    {
                      numero_bloc: "RNCP34606BC15",
                      intitule: "Éducation physique et sportive (bloc facultatif)",
                    },
                  ],
                  voix_acces: [
                    {
                      code_libelle: "CANDIDATURE",
                      intitule: "Par candidature individuelle",
                    },
                    {
                      code_libelle: "CONTRATA",
                      intitule: "En contrat d'apprentissage",
                    },
                    {
                      code_libelle: "CONTRATP",
                      intitule: "En contrat de professionnalisation",
                    },
                    {
                      code_libelle: "ELEVE",
                      intitule: "Après un parcours de formation sous statut d'élève ou d'étudiant",
                    },
                    {
                      code_libelle: "EXP",
                      intitule: "Par expérience",
                    },
                    {
                      code_libelle: "PFC",
                      intitule: "Après un parcours de formation continue",
                    },
                  ],
                },
                rome_codes: ["D1401", "M1501", "M1607", "M1203"],
                periode: '["2020-09", "2021-09"]',
                capacite: null,
                duree: null,
                annee: null,
                email: "contant@email.fr",
                parcoursup_reference: false,
                parcoursup_a_charger: true,
                affelnet_reference: false,
                affelnet_a_charger: false,
                source: "WS RCO",
                commentaires: null,
                opcos: [
                  "OPCO Commerce",
                  "OPCO Mobilité",
                  "OPCO Cohésion sociale",
                  "OCAPIAT",
                  "OPCO entreprises et salariés des services à forte intensité de main-d'œuvre",
                  "OPCO 2i",
                  "OPCO entreprises de proximité",
                ],
                info_opcos: 1,
                info_opcos_intitule: "Trouvés",
                published: false,
                draft: false,
                last_update_who: null,
                to_verified: false,
                update_error: null,
                lieu_formation_adresse: "31 rue des lilas",
                lieu_formation_siret: null,
                id_rco_formation: "01_GE107880|01_GE339324|01_GE520062|76930",
                lieu_formation_geo_coordonnees: "48.879706,2.396444",
                geo_coordonnees_etablissement_gestionnaire: "48.879706,2.396444",
                geo_coordonnees_etablissement_formateur: "48.879706,2.396444",
                idea_geo_coordonnees_etablissement: "48.879706,2.396444",
                created_at: "2020-12-01T10:09:48.309Z",
                last_update_at: "2021-01-21T08:24:21.784Z",
                parcoursup_statut: "hors périmètre",
                affelnet_statut: "hors périmètre",
                tags: ["2020", "2021"],
                affelnet_error: null,
                parcoursup_error: null,
                id: "5fc6166c712d48a9881333ac",
              },
            ],
            pagination: {
              page: 1,
              resultats_par_page: 10,
              nombre_de_page: 1,
              total: 1,
            },
          },
          custom
        );
      },
    };

    return createAxios(CatalogueApi, responses, callback, options);
  },
  getMockedGeoAddresseApi(callback, options = {}) {
    let instance = axios.create(options);
    options.debug && debug(instance);

    let featureCollection = {
      type: "FeatureCollection",
      version: "draft",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [2.396444, 48.879706],
          },
          properties: {
            label: "31 Rue des lilas 75019 Paris",
            score: 0.88,
            housenumber: "31",
            id: "75119_5683_00031",
            name: "31 Rue des Lilas",
            postcode: "75019",
            citycode: "75119",
            x: 655734.91,
            y: 6864578.76,
            city: "Paris",
            district: "Paris 19e Arrondissement",
            context: "75, Paris, Île-de-France",
            type: "housenumber",
            importance: 0.73991,
            street: "Rue des Lilas",
          },
        },
      ],
      attribution: "BAN",
      licence: "ETALAB-2.0",
      query: '31 rue des lilas 75019 Paris"',
      limit: 5,
    };

    let responses = {
      search(custom = {}) {
        return merge({}, featureCollection, custom);
      },
      reverse(custom = {}) {
        return merge({}, omit(featureCollection, ["query"]), custom);
      },
    };

    return createAxios(GeoAdresseApi, responses, callback, options);
  },
  getMockedSireneApi(callback, options = {}) {
    let instance = axios.create(options);
    options.debug && debug(instance);

    let responses = {
      unitesLegales(custom = {}) {
        return merge(
          {},
          {
            unite_legale: {
              id: 129568762,
              siren: "111111111",
              statut_diffusion: "O",
              unite_purgee: null,
              date_creation: "2015-11-01",
              sigle: null,
              sexe: null,
              prenom_1: null,
              prenom_2: null,
              prenom_3: null,
              prenom_4: null,
              prenom_usuel: null,
              pseudonyme: null,
              identifiant_association: null,
              tranche_effectifs: "01",
              annee_effectifs: "2018",
              date_dernier_traitement: "2020-12-16T11:32:46",
              nombre_periodes: "3",
              categorie_entreprise: "PME",
              annee_categorie_entreprise: "2018",
              date_fin: null,
              date_debut: "2020-11-27",
              etat_administratif: "A",
              nom: null,
              nom_usage: null,
              denomination: "NOMAYO",
              denomination_usuelle_1: null,
              denomination_usuelle_2: null,
              denomination_usuelle_3: null,
              categorie_juridique: "5710",
              activite_principale: "62.02A",
              nomenclature_activite_principale: "NAFRev2",
              nic_siege: "00006",
              economie_sociale_solidaire: "N",
              caractere_employeur: "O",
              created_at: "2021-02-02T02:54:53.578+01:00",
              updated_at: "2021-02-02T02:54:53.578+01:00",
              etablissement_siege: {
                id: 276827433,
                siren: "111111111",
                nic: "11111",
                siret: "11111111100006",
                statut_diffusion: "O",
                date_creation: "2020-11-27",
                tranche_effectifs: null,
                annee_effectifs: null,
                activite_principale_registre_metiers: null,
                date_dernier_traitement: "2020-12-16T11:32:46",
                etablissement_siege: "true",
                nombre_periodes: "1",
                complement_adresse: null,
                numero_voie: "31",
                indice_repetition: "B",
                type_voie: "RUE",
                libelle_voie: "DES LILAS",
                code_postal: "75019",
                libelle_commune: "PARIS",
                libelle_commune_etranger: null,
                distribution_speciale: null,
                code_commune: "75000",
                code_cedex: null,
                libelle_cedex: null,
                code_pays_etranger: null,
                libelle_pays_etranger: null,
                complement_adresse_2: null,
                numero_voie_2: null,
                indice_repetition_2: null,
                type_voie_2: null,
                libelle_voie_2: null,
                code_postal_2: null,
                libelle_commune_2: null,
                libelle_commune_etranger_2: null,
                distribution_speciale_2: null,
                code_commune_2: null,
                code_cedex_2: null,
                libelle_cedex_2: null,
                code_pays_etranger_2: null,
                libelle_pays_etranger_2: null,
                date_debut: "2020-11-27",
                etat_administratif: "A",
                enseigne_1: null,
                enseigne_2: null,
                enseigne_3: null,
                denomination_usuelle: null,
                activite_principale: "62.02A",
                nomenclature_activite_principale: "NAFRev2",
                caractere_employeur: "O",
                longitude: "2.396147",
                latitude: "48.880391",
                geo_score: "0.88",
                geo_type: "housenumber",
                geo_adresse: "31 rue des lilas Paris 75019",
                geo_id: "75019_1475_00031_bis",
                geo_ligne: "G",
                geo_l4: "31 RUE DES LILAS",
                geo_l5: null,
                unite_legale_id: 129568762,
                created_at: "2021-02-02T17:46:40.046+01:00",
                updated_at: "2021-02-02T17:46:40.046+01:00",
              },
              numero_tva_intra: "FR74814562112",
              etablissements: [
                {
                  id: 276827433,
                  siren: "111111111",
                  nic: "11111",
                  siret: "11111111100006",
                  statut_diffusion: "O",
                  date_creation: "2020-11-27",
                  tranche_effectifs: null,
                  annee_effectifs: null,
                  activite_principale_registre_metiers: null,
                  date_dernier_traitement: "2020-12-16T11:32:46",
                  etablissement_siege: "true",
                  nombre_periodes: "1",
                  complement_adresse: null,
                  numero_voie: "31",
                  indice_repetition: "B",
                  type_voie: "RUE",
                  libelle_voie: "DES LILAS",
                  code_postal: "75001",
                  libelle_commune: "PARIS",
                  libelle_commune_etranger: null,
                  distribution_speciale: null,
                  code_commune: "75000",
                  code_cedex: null,
                  libelle_cedex: null,
                  code_pays_etranger: null,
                  libelle_pays_etranger: null,
                  complement_adresse_2: null,
                  numero_voie_2: null,
                  indice_repetition_2: null,
                  type_voie_2: null,
                  libelle_voie_2: null,
                  code_postal_2: null,
                  libelle_commune_2: null,
                  libelle_commune_etranger_2: null,
                  distribution_speciale_2: null,
                  code_commune_2: null,
                  code_cedex_2: null,
                  libelle_cedex_2: null,
                  code_pays_etranger_2: null,
                  libelle_pays_etranger_2: null,
                  date_debut: "2020-11-27",
                  etat_administratif: "A",
                  enseigne_1: null,
                  enseigne_2: null,
                  enseigne_3: null,
                  denomination_usuelle: null,
                  activite_principale: "62.02A",
                  nomenclature_activite_principale: "NAFRev2",
                  caractere_employeur: "O",
                  longitude: "2.396147",
                  latitude: "48.880391",
                  geo_score: "0.88",
                  geo_type: "housenumber",
                  geo_adresse: "31 rue des lilas Paris 75001",
                  geo_id: "75001_1475_00031_bis",
                  geo_ligne: "G",
                  geo_l4: "31 RUE DES LILAS",
                  geo_l5: null,
                  unite_legale_id: 129568762,
                  created_at: "2021-02-02T17:46:40.046+01:00",
                  updated_at: "2021-02-02T17:46:40.046+01:00",
                },
              ],
            },
          },
          custom
        );
      },
      etablissement(custom = {}) {
        return merge(
          {},
          {
            etablissement: {
              id: 276827433,
              siren: "111111111",
              nic: "11111",
              siret: "11111111100006",
              statut_diffusion: "O",
              date_creation: "2020-11-27",
              tranche_effectifs: null,
              annee_effectifs: null,
              activite_principale_registre_metiers: null,
              date_dernier_traitement: "2020-12-16T11:32:46",
              etablissement_siege: "true",
              nombre_periodes: "1",
              complement_adresse: null,
              numero_voie: "31",
              indice_repetition: "B",
              type_voie: "RUE",
              libelle_voie: "DES LILAS",
              code_postal: "75019",
              libelle_commune: "PARIS",
              libelle_commune_etranger: null,
              distribution_speciale: null,
              code_commune: "75000",
              code_cedex: null,
              libelle_cedex: null,
              code_pays_etranger: null,
              libelle_pays_etranger: null,
              complement_adresse_2: null,
              numero_voie_2: null,
              indice_repetition_2: null,
              type_voie_2: null,
              libelle_voie_2: null,
              code_postal_2: null,
              libelle_commune_2: null,
              libelle_commune_etranger_2: null,
              distribution_speciale_2: null,
              code_commune_2: null,
              code_cedex_2: null,
              libelle_cedex_2: null,
              code_pays_etranger_2: null,
              libelle_pays_etranger_2: null,
              date_debut: "2020-11-27",
              etat_administratif: "A",
              enseigne_1: null,
              enseigne_2: null,
              enseigne_3: null,
              denomination_usuelle: null,
              activite_principale: "62.02A",
              nomenclature_activite_principale: "NAFRev2",
              caractere_employeur: "O",
              longitude: "2.396147",
              latitude: "48.880391",
              geo_score: "0.88",
              geo_type: "housenumber",
              geo_adresse: "31 rue des lilas Paris 75019",
              geo_id: "75019_1475_00031_bis",
              geo_ligne: "G",
              geo_l4: "31 RUE DES LILAS",
              geo_l5: null,
              unite_legale_id: 129568762,
              created_at: "2021-02-02T17:46:40.046+01:00",
              updated_at: "2021-02-02T17:46:40.046+01:00",
            },
          },
          custom
        );
      },
    };

    return createAxios(SireneApi, responses, callback, options);
  },
  getMockedAcceApi(callback, options = {}) {
    let responses = {
      index(file = "./fixtures/acceIndexResponse.html") {
        return readFileSync(path.join(__dirname, file), "UTF-8");
      },
      search(file = "./fixtures/acceSearchResponse.html") {
        return readFileSync(path.join(__dirname, file), "UTF-8");
      },
      etablissement(file = "./fixtures/acceEtablissementResponse.html") {
        return readFileSync(path.join(__dirname, file), "UTF-8");
      },
      noGeoloc(file = "./fixtures/noGeoloc.html") {
        return readFileSync(path.join(__dirname, file), "UTF-8");
      },
    };

    return createAxios(AcceApi, responses, callback, options);
  },
};
