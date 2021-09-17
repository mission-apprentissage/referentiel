const { object, objectId, string, boolean, arrayOf, date } = require("./schemas/jsonSchemaTypes");
const adresseSchema = require("./schemas/adresseSchema");

module.exports = {
  name: "etablissements",
  schema: () => {
    let required = [
      "siret",
      "uais",
      "contacts",
      "relations",
      "lieux_de_formation",
      "certifications",
      "diplomes",
      "_meta",
    ];

    return object(
      {
        _id: objectId(),
        siret: string(),
        uai: string(),
        raison_sociale: string(),
        siege_social: boolean(),
        statut: string({ enum: ["actif", "fermé"] }),
        adresse: adresseSchema,
        forme_juridique: object(
          {
            code: string(),
            label: string(),
          },
          { required: ["code", "label"] }
        ),
        gestionnaire: boolean(),
        formateur: boolean(),
        referentiels: arrayOf(string()),
        reseaux: arrayOf(string()),
        conformite_reglementaire: object({
          conventionne: boolean(),
          certificateur: string(),
        }),
        uais: arrayOf(
          object(
            {
              sources: arrayOf(string()),
              uai: string(),
              valide: boolean(),
            },
            { required: ["uai", "valide"] }
          )
        ),
        contacts: arrayOf(
          object(
            {
              email: string(),
              confirmé: boolean(),
              sources: arrayOf(string()),
              _extras: object({}, { additionalProperties: true }),
            },
            { required: ["email", "confirmé", "sources"] }
          )
        ),
        relations: arrayOf(
          object(
            {
              siret: string(),
              annuaire: boolean(),
              sources: arrayOf(string()),
              label: string(),
              type: string({ enum: ["formateur", "gestionnaire", "fille", "mère"] }),
            },
            { required: ["siret", "annuaire", "sources"] }
          )
        ),
        lieux_de_formation: arrayOf(
          object(
            {
              siret: string(),
              adresse: adresseSchema,
            },
            { required: ["adresse"] }
          )
        ),
        certifications: arrayOf(
          object(
            {
              code: string(),
              type: string({ enum: ["rncp"] }),
              label: string(),
            },
            { required: ["code", "type"] }
          )
        ),
        diplomes: arrayOf(
          object(
            {
              code: string(),
              type: string({ enum: ["cfd"] }),
              niveau: string(),
              label: string(),
            },
            { required: ["code", "type"] }
          )
        ),
        _meta: object(
          {
            created_at: date(),
            anomalies: arrayOf(
              object(
                {
                  job: string(),
                  source: string(),
                  date: date(),
                  code: string(),
                  details: string(),
                },
                { required: ["job", "source", "date"] }
              )
            ),
          },
          { required: ["anomalies", "created_at"] }
        ),
      },
      { required }
    );
  },
  createIndexes: (dbCollection) => {
    return [
      dbCollection.createIndex({ siret: 1 }, { unique: true }),
      dbCollection.createIndex({ uai: 1 }, { sparse: true, unique: true }),
      dbCollection.createIndex({ "uais.uai": 1 }),
      dbCollection.createIndex({ "$**": "text" }, { default_language: "french" }),
      dbCollection.createIndex({ "adresse.geojson.geometry": "2dsphere" }),
    ];
  },
};
