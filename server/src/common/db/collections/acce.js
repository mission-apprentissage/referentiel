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
        }),
        administration: object({
          nature: string(),
          niveau: string(),
          categorie_juridique: string(),
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
};
