const { object, objectId, string, date } = require("./schemas/jsonSchemaTypes");

module.exports = {
  name: "modifications",
  schema: () => {
    let required = ["siret", "uai", "date", "auteur"];

    return object(
      {
        _id: objectId(),
        siret: string(),
        uai: string(),
        date: date(),
        auteur: string(),
      },
      { required }
    );
  },
  indexes: () => {
    return [[{ siret: 1 }], [{ date: 1 }]];
  },
};
