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
        etat_administratif: string({ enum: ["actif", "fermé"] }),
        statuts: arrayOf(string({ enum: ["gestionnaire", "formateur"] })),
        adresse: adresseSchema,
        forme_juridique: object(
          {
            code: string(),
            label: string(),
          },
          { required: ["code", "label"] }
        ),
        referentiels: arrayOf(string()),
        reseaux: arrayOf(string()),
        conformite_reglementaire: object({
          conventionne: boolean(),
          certificateur: string(),
        }),
        uais: arrayOf(
          object(
            {
              uai: string(),
              valide: boolean(),
              sources: arrayOf(string()),
              confirmé: boolean(),
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
              referentiel: boolean(),
              label: string(),
              type: string({ enum: ["formateur", "gestionnaire", "fille", "mère"] }),
              sources: arrayOf(string()),
            },
            { required: ["siret", "referentiel", "sources"] }
          )
        ),
        lieux_de_formation: arrayOf(
          object(
            {
              code: string(),
              siret: string(),
              adresse: adresseSchema,
              sources: arrayOf(string()),
            },
            { required: ["code", "adresse"] }
          )
        ),
        certifications: arrayOf(
          object(
            {
              code: string(),
              type: string({ enum: ["rncp"] }),
              label: string(),
              sources: arrayOf(string()),
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
              sources: arrayOf(string()),
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
      dbCollection.createIndex({ "adresse.geojson.geometry": "2dsphere" }),
      dbCollection.createIndex(
        { siret: "text", uai: "text", "uais.uai": "text", raison_sociale: "text" },
        { name: "fulltext", default_language: "french" }
      ),
    ];
  },
};
