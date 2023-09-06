const { object, objectId, string, array } = require("./schemas/jsonSchemaTypes");

module.exports = {
  name: "users",
  schema: () => {
    return object(
      {
        _id: objectId(),
        email: string(),
        hashedPassword: string(),
        refreshToken: array(),
        type: string(),
        code: string(),
      },
      { required: ["email"] }
    );
  },
  indexes: () => {
    return [[{ email: 1 }, { unique: true }]];
  },
};
