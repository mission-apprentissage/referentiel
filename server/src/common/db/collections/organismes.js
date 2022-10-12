const { object, objectId, string, boolean, arrayOf, date } = require("./schemas/jsonSchemaTypes");
const adresseSchema = require("./schemas/adresseSchema");

module.exports = {
  name: "organismes",
  schema: () => {
    const required = [
      "siret",
      "nature",
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
        nature: string({ enum: ["responsable", "formateur", "responsable_formateur", "inconnue"] }),
        adresse: adresseSchema,
        forme_juridique: object(
          {
            code: string(),
            label: string(),
          },
          { required: ["code", "label"] }
        ),
        referentiels: arrayOf(string()),
        reseaux: arrayOf(
          object(
            {
              code: string(),
              label: string(),
              sources: arrayOf(string()),
              date_collecte: date(),
            },
            { required: ["code", "label"] }
          )
        ),
        qualiopi: boolean(),
        uai_potentiels: arrayOf(
          object(
            {
              uai: string(),
              sources: arrayOf(string()),
              date_collecte: date(),
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
              date_collecte: date(),
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
              date_collecte: date(),
            },
            { required: ["siret", "referentiel", "sources", "type"] }
          )
        ),
        lieux_de_formation: arrayOf(
          object(
            {
              code: string(),
              siret: string(),
              uai: string(),
              adresse: adresseSchema,
              sources: arrayOf(string()),
              date_collecte: date(),
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
              date_collecte: date(),
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
              date_collecte: date(),
            },
            { required: ["code", "type"] }
          )
        ),
        _meta: object(
          {
            date_import: date(),
            date_dernier_import: date(),
            date_collecte: date(),
            anomalies: arrayOf(
              object(
                {
                  key: string(),
                  type: string(),
                  job: string(),
                  code: string(),
                  details: string(),
                  sources: arrayOf(string()),
                  date_collecte: date(),
                },
                { required: ["key", "job", "sources", "date_collecte"] }
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
      [{ numero_declaration_activite: 1 }],
      [{ nature: 1 }],
      [{ referentiels: 1 }],
      [{ "adresse.departement.code": 1 }],
      [{ "adresse.region.code": 1 }],
      [{ "adresse.academie.code": 1 }],
      [{ "relations.type": 1 }],
      [{ etat_administratif: 1 }],
      [{ qualiopi: 1 }],
      [{ "adresse.geojson.geometry": "2dsphere" }],
      [
        { siret: "text", uai: "text", raison_sociale: "text" },
        { name: "fulltext", default_language: "french" },
      ],
    ];
  },
};
