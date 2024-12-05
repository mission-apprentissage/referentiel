const { object, objectId, string, date } = require("./schemas/jsonSchemaTypes");

module.exports = {
  name: "modifications",
  schema: () => {
    const required = ["siret", "date", "auteur", "original", "changements"];

    return object(
      {
        _id: objectId(),
        siret: string(),
        date: date(),
        auteur: string(),
        email: string(),
        original: object({}, { additionalProperties: true }),
        changements: object({}, { additionalProperties: true }),
      },
      { required }
    );
  },
  indexes: () => {
    return [[{ siret: 1 }], [{ date: 1 }]];
  },
};
