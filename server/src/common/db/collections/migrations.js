const { object, objectId, number } = require("./schemas/jsonSchemaTypes");

module.exports = {
  name: "migrations",
  schema: () => {
    const required = ["version"];

    return object(
      {
        _id: objectId(),
        version: number(),
      },
      { required }
    );
  },
  indexes: () => {
    return [[{ version: 1 }]];
  },
};
