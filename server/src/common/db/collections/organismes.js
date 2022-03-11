const { object, objectId, string, boolean, arrayOf, date } = require("./schemas/jsonSchemaTypes");
const adresseSchema = require("./schemas/adresseSchema");

module.exports = {
  name: "organismes",
  schema: () => {
    let required = [
      "siret",
      "uai_potentiels",
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
        enseigne: string(),
        siege_social: boolean(),
        numero_declaration_activite: string(),
        etat_administratif: string({ enum: ["actif", "fermé"] }),
        natures: arrayOf(string({ enum: ["responsable", "formateur"] })),
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
        qualiopi: boolean(),
        uai_potentiels: arrayOf(
          object(
            {
              uai: string(),
              sources: arrayOf(string()),
            },
            { required: ["uai"] }
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
              type: string({
                enum: ["formateur->responsable", "responsable->formateur", "entreprise"],
              }),
              siret: string(),
              referentiel: boolean(),
              label: string(),
              sources: arrayOf(string()),
            },
            { required: ["siret", "referentiel", "sources", "type"] }
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
            date_import: date(),
            date_de_fermeture: date(),
            anomalies: arrayOf(
              object(
                {
                  key: string(),
                  type: string(),
                  job: string(),
                  sources: arrayOf(string()),
                  date: date(),
                  code: string(),
                  details: string(),
                },
                { required: ["key", "job", "sources", "date"] }
              )
            ),
          },
          { required: ["anomalies", "date_import"] }
        ),
      },
      { required }
    );
  },
  indexes: () => {
    return [
      [{ siret: 1 }, { unique: true }],
      [{ uai: 1 }],
      [{ "uai_potentiels.uai": 1 }],
      [{ "adresse.geojson.geometry": "2dsphere" }],
      [
        { siret: "text", uai: "text", raison_sociale: "text" },
        { name: "fulltext", default_language: "french" },
      ],
    ];
  },
};
