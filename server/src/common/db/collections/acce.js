const { object, objectId, string, arrayOf, date, integer } = require("./schemas/jsonSchemaTypes");
const geojsonSchema = require("./schemas/geojsonSchema");

module.exports = {
  name: "acce",
  schema: () => {
    let required = ["uai", "specificites", "rattachements"];

    return object(
      {
        _id: objectId(),
        uai: string(),
        siret: string(),
        nom: string(),
        adresse: string(),
        academie: string(),
        tel: string(),
        fax: string(),
        email: string(),
        site_web: string(),
        maj: date(),
        etat: string(),
        dateOuverture: date(),
        dateDeFermeture: date(),
        inconnu1: string(),
        tutelle: string(),
        secteur: string(),
        inconnu2: string(),
        contrat: string(),
        denominations: object({
          sigle: string(),
          denomination_principale: string(),
          patronyme: string(),
        }),
        localisation: object({
          adresse: string(),
          acheminement: string(),
          lieu_dit: string(),
          complement_adresse: string(),
        }),
        administration: object({
          nature: string(),
          niveau: string(),
          categorie_juridique: string(),
          categorie_financiere: string(),
          situation_comptable: string(),
          hebergement: string(),
        }),
        zones: object({
          agglomeration_urbaine: string(),
          bassin_de_formation: string(),
          canton: string(),
          commune: string(),
          circonscription_ien: string(),
          centre_information_et_orientation: string(),
          pole_inclusif_accompagnement_localise: string(),
          secteur_scolaire: string(),
          zone_animation_pedagogique: string(),
          greta: string(),
          groupement_comptable: string(),
          cite_scolaire: string(),
          cite_educative: string(),
          reseau_education_prioritaire: string(),
          reseau_education_prioritaire_plus: string(),
          reseau_academique: string(),
          association_etablissements_du_superieur_ou_organismes_de_recherche: string(),
          ecoles_colleges_lycees_pour_ambition_innovation_et_la_reussite: string(),
          pole_universitaire: string(),
          antenne_universite: string(),
          etablissement_public_experimental: string(),
          communaute_universites_et_etablissements: string(),
          institut_catholique: string(),
          chambre_de_commerce_et_industrie: string(),
        }),
        specificites: arrayOf(string()),
        rattachements: object(
          {
            mere: arrayOf(
              object({
                uai: string(),
                siret: string(),
                sigle: string(),
                patronyme: string(),
                nature: string(),
                commune: string(),
              })
            ),
            fille: arrayOf(
              object({
                uai: string(),
                siret: string(),
                sigle: string(),
                patronyme: string(),
                nature: string(),
                commune: string(),
              })
            ),
          },
          { required: ["fille", "mere"] }
        ),
        geojson: geojsonSchema,
        _search: object({
          searchIndex: integer(),
          searchParams: string(),
        }),
      },
      { required }
    );
  },
  createIndexes: (dbCollection) => {
    return [dbCollection.createIndex({ uai: 1 })];
  },
};
