const { jsonSchemaTypes, withDefaultsBuilder } = require("../../utils/jsonSchema");

const acceSchema = (options = {}) => {
  let { object, objectId, string, number, integer, arrayOf, date } = jsonSchemaTypes(options);

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
      }),
      zones: object({
        agglomeration_urbaine: string(),
        bassin_de_formation: string(),
        canton: string(),
        commune: string(),
      }),
      specificites: arrayOf(string()),
      rattachements: object({
        mere: arrayOf(
          object({
            uai: string(),
            sigle: string(),
            patronyme: string(),
            nature: string(),
            commune: string(),
          })
        ),
        fille: arrayOf(
          object({
            uai: string(),
            sigle: string(),
            patronyme: string(),
            nature: string(),
            commune: string(),
          })
        ),
      }),
      geojson: object(
        {
          type: string(),
          geometry: object(
            {
              type: string(),
              coordinates: arrayOf(number()),
            },
            { required: ["type", "coordinates"] }
          ),
        },
        { required: ["type"] }
      ),
      _search: object({
        searchIndex: integer(),
        searchParams: string(),
      }),
    },
    { required: ["uai"] }
  );
};

module.exports = {
  acceSchema,
  withDefaults: withDefaultsBuilder(acceSchema()),
};
