const { object, objectId, string, array, boolean } = require("./schemas/jsonSchemaTypes");

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
        nom: string(),
        isAdmin: boolean(),
      },
      { required: ["email"] }
    );
  },
  indexes: () => {
    return [[{ email: 1 }, { unique: true }]];
  },
};
