const { object, objectId, string, date } = require("./schemas/jsonSchemaTypes");

module.exports = {
  name: "modifications",
  schema: () => {
    let required = ["siret", "date", "auteur", "original", "changements"];

    return object(
      {
        _id: objectId(),
        siret: string(),
        date: date(),
        auteur: string(),
        original: object({
          uai: string(),
        }),
        changements: object({
          uai: string(),
        }),
      },
      { required }
    );
  },
  indexes: () => {
    return [[{ siret: 1 }], [{ date: 1 }]];
  },
};
