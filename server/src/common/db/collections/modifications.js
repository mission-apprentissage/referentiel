const { object, objectId, string, date } = require("./schemas/jsonSchemaTypes");

module.exports = {
  name: "modifications",
  schema: () => {
    let required = ["siret", "_meta"];

    return object(
      {
        _id: objectId(),
        siret: string(),
        uai: string(),
        _meta: object(
          {
            created_at: date(),
          },
          { required: ["created_at"] }
        ),
      },
      { required }
    );
  },
  indexes: () => {
    return [[{ siret: 1 }], [{ "_meta.created_at": 1 }]];
  },
};
