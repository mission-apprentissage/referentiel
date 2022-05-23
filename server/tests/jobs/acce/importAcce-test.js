const { omit } = require("lodash");
const assert = require("assert");
const importAcce = require("../../../src/jobs/importAcce");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createStream } = require("../../utils/testUtils");

describe("importAcce", () => {
  it("Vérifie qu'on peut importer un etablissement", async () => {
    const stats = await importAcce({
      input: createStream(
        `numero_uai;nature_uai;nature_uai_libe;type_uai;type_uai_libe;etat_etablissement;etat_etablissement_libe;ministere_tutelle;ministere_tutelle_libe;tutelle_2;tutelle_2_libe;secteur_public_prive;secteur_public_prive_libe;sigle_uai;categorie_juridique;categorie_juridique_libe;contrat_etablissement;contrat_etablissement_libe;categorie_financiere;categorie_financiere_libe;situation_comptable;situation_comptable_libe;niveau_uai;niveau_uai_libe;commune;commune_libe;academie;academie_libe;pays;pays_libe;departement_insee_3;departement_insee_3_libe;denomination_principale;appellation_officielle;patronyme_uai;hebergement_etablissement;hebergement_etablissement_libe;numero_siren_siret_uai;numero_finess_uai;date_ouverture;date_fermeture;date_derniere_mise_a_jour;lieu_dit_uai;adresse_uai;boite_postale_uai;code_postal_uai;etat_sirad_uai;localite_acheminement_uai;pays_etranger_acheminement;numero_telephone_uai;numero_telecopieur_uai;mention_distribution;mel_uai;site_web;coordonnee_x;coordonnee_y;appariement;appariement_complement;localisation;localisation_complement;date_geolocalisation;source
0751234J;320;Lycée professionnel;LP;Lycées professionnels;1;Ouvert;06;ministére de l'éducation nationale;;;PU;Public;LP LYC METIER;200;Etablissement public local d'enseignement (EPLE);99;Sans objet;4;4;2;Siége de l'agence comptable;1;UAI célibataire;1000;Paris;01;Paris;100;France;001;Paris;LP LYCEE DES METIERS;Lycée professionnel;Centre de formation;22;Avec internat et demi-pension;11111111100006;;01/05/1965;;23/11/2021;;36 rue des lilas;;75001;1;PARIS;;01 23 45 67 89;01 23 45 67 89;;contact@formation.fr;https://formation.fr/;881947.9;6544401.7;Parfaite;;Numéro de rue;;18/11/2021;IGN`
      ),
    });

    const found = await dbCollection("acce").findOne({});
    assert.deepStrictEqual(omit(found, ["_id"]), {
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
    });
    assert.deepStrictEqual(stats, {
      total: 1,
      created: 1,
      updated: 0,
      failed: 0,
    });
  });

  it("Vérifie qu'on importe les établissements à ouvrir", async () => {
    let input = createStream(
      `numero_uai;nature_uai;nature_uai_libe;type_uai;type_uai_libe;etat_etablissement;etat_etablissement_libe;ministere_tutelle;ministere_tutelle_libe;tutelle_2;tutelle_2_libe;secteur_public_prive;secteur_public_prive_libe;sigle_uai;categorie_juridique;categorie_juridique_libe;contrat_etablissement;contrat_etablissement_libe;categorie_financiere;categorie_financiere_libe;situation_comptable;situation_comptable_libe;niveau_uai;niveau_uai_libe;commune;commune_libe;academie;academie_libe;pays;pays_libe;departement_insee_3;departement_insee_3_libe;denomination_principale;appellation_officielle;patronyme_uai;hebergement_etablissement;hebergement_etablissement_libe;numero_siren_siret_uai;numero_finess_uai;date_ouverture;date_fermeture;date_derniere_mise_a_jour;lieu_dit_uai;adresse_uai;boite_postale_uai;code_postal_uai;etat_sirad_uai;localite_acheminement_uai;pays_etranger_acheminement;numero_telephone_uai;numero_telecopieur_uai;mention_distribution;mel_uai;site_web;coordonnee_x;coordonnee_y;appariement;appariement_complement;localisation;localisation_complement;date_geolocalisation;source
0751234J;320;Lycée professionnel;LP;Lycées professionnels;1;À ouvrir;06;ministére de l'éducation nationale;;;PU;Public;LP LYC METIER;200;Etablissement public local d'enseignement (EPLE);99;Sans objet;4;4;2;Siége de l'agence comptable;1;UAI célibataire;1000;Paris;01;Paris;100;France;001;Paris;LP LYCEE DES METIERS;Lycée professionnel;Centre de formation;22;Avec internat et demi-pension;11111111100006;;01/05/1965;;23/11/2021;;36 rue des lilas;;75001;1;PARIS;;01 23 45 67 89;01 23 45 67 89;;contact@formation.fr;https://formation.fr/;881947.9;6544401.7;Parfaite;;Numéro de rue;;18/11/2021;IGN`
    );

    const stats = await importAcce({ input });

    const found = await dbCollection("acce").findOne({});
    assert.strictEqual(found.etat_etablissement_libe, "À ouvrir");
    assert.deepStrictEqual(stats, {
      total: 1,
      created: 1,
      updated: 0,
      failed: 0,
    });
  });

  it("Vérifie qu'on ignore les établissements fermés", async () => {
    const stats = await importAcce({
      input: createStream(
        `numero_uai;nature_uai;nature_uai_libe;type_uai;type_uai_libe;etat_etablissement;etat_etablissement_libe;ministere_tutelle;ministere_tutelle_libe;tutelle_2;tutelle_2_libe;secteur_public_prive;secteur_public_prive_libe;sigle_uai;categorie_juridique;categorie_juridique_libe;contrat_etablissement;contrat_etablissement_libe;categorie_financiere;categorie_financiere_libe;situation_comptable;situation_comptable_libe;niveau_uai;niveau_uai_libe;commune;commune_libe;academie;academie_libe;pays;pays_libe;departement_insee_3;departement_insee_3_libe;denomination_principale;appellation_officielle;patronyme_uai;hebergement_etablissement;hebergement_etablissement_libe;numero_siren_siret_uai;numero_finess_uai;date_ouverture;date_fermeture;date_derniere_mise_a_jour;lieu_dit_uai;adresse_uai;boite_postale_uai;code_postal_uai;etat_sirad_uai;localite_acheminement_uai;pays_etranger_acheminement;numero_telephone_uai;numero_telecopieur_uai;mention_distribution;mel_uai;site_web;coordonnee_x;coordonnee_y;appariement;appariement_complement;localisation;localisation_complement;date_geolocalisation;source
0751234J;320;Lycée professionnel;LP;Lycées professionnels;1;Fermé;06;ministére de l'éducation nationale;;;PU;Public;LP LYC METIER;200;Etablissement public local d'enseignement (EPLE);99;Sans objet;4;4;2;Siége de l'agence comptable;1;UAI célibataire;1000;Paris;01;Paris;100;France;001;Paris;LP LYCEE DES METIERS;Lycée professionnel;Centre de formation;22;Avec internat et demi-pension;11111111100006;;01/05/1965;;23/11/2021;;36 rue des lilas;;75001;1;PARIS;;01 23 45 67 89;01 23 45 67 89;;contact@formation.fr;https://formation.fr/;881947.9;6544401.7;Parfaite;;Numéro de rue;;18/11/2021;IGN`
      ),
    });

    assert.deepStrictEqual(stats, {
      total: 1,
      created: 0,
      updated: 0,
      failed: 0,
    });
  });

  it("Vérifie qu'on ignore certaines natures", async () => {
    const stats = await importAcce({
      input: createStream(
        `numero_uai;nature_uai;nature_uai_libe;type_uai;type_uai_libe;etat_etablissement;etat_etablissement_libe;ministere_tutelle;ministere_tutelle_libe;tutelle_2;tutelle_2_libe;secteur_public_prive;secteur_public_prive_libe;sigle_uai;categorie_juridique;categorie_juridique_libe;contrat_etablissement;contrat_etablissement_libe;categorie_financiere;categorie_financiere_libe;situation_comptable;situation_comptable_libe;niveau_uai;niveau_uai_libe;commune;commune_libe;academie;academie_libe;pays;pays_libe;departement_insee_3;departement_insee_3_libe;denomination_principale;appellation_officielle;patronyme_uai;hebergement_etablissement;hebergement_etablissement_libe;numero_siren_siret_uai;numero_finess_uai;date_ouverture;date_fermeture;date_derniere_mise_a_jour;lieu_dit_uai;adresse_uai;boite_postale_uai;code_postal_uai;etat_sirad_uai;localite_acheminement_uai;pays_etranger_acheminement;numero_telephone_uai;numero_telecopieur_uai;mention_distribution;mel_uai;site_web;coordonnee_x;coordonnee_y;appariement;appariement_complement;localisation;localisation_complement;date_geolocalisation;source
0751234J;320;Nature à exclure;LP;Lycées professionnels;1;Ouvert;06;ministére de l'éducation nationale;;;PU;Public;LP LYC METIER;200;Etablissement public local d'enseignement (EPLE);99;Sans objet;4;4;2;Siége de l'agence comptable;1;UAI célibataire;1000;Paris;01;Paris;100;France;001;Paris;LP LYCEE DES METIERS;Lycée professionnel;Centre de formation;22;Avec internat et demi-pension;11111111100006;;01/05/1965;;23/11/2021;;36 rue des lilas;;75001;1;PARIS;;01 23 45 67 89;01 23 45 67 89;;contact@formation.fr;https://formation.fr/;881947.9;6544401.7;Parfaite;;Numéro de rue;;18/11/2021;IGN`
      ),
    });

    assert.deepStrictEqual(stats, {
      total: 1,
      created: 0,
      updated: 0,
      failed: 0,
    });
  });
});
