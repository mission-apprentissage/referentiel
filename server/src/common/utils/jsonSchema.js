const Ajv = require("ajv");
const { cloneDeep, omit } = require("lodash");

const ajv = new Ajv({ useDefaults: true });

module.exports = {
  jsonSchemaTypes: (options = {}) => {
    let handleCustom = options.bson
      ? (custom) => omit(custom, ["$ref", "$schema", "default", "definitions", "format", "id"])
      : (custom) => custom;

    return {
      number: (custom = {}) => ({ bsonType: "number", ...handleCustom(custom) }),
      integer: (custom = {}) => ({ bsonType: "int", ...handleCustom(custom) }),
      objectId: (custom = {}) => ({ bsonType: "objectId", ...handleCustom(custom) }),
      string: (custom = {}) => ({ bsonType: "string", ...handleCustom(custom) }),
      date: (custom = {}) => ({ bsonType: "date", ...handleCustom(custom) }),
      arrayOf: (items, custom = {}) => {
        return {
          bsonType: "array",
          ...(options.bson ? {} : { default: [] }),
          ...handleCustom(custom),
          items,
        };
      },
      object: (properties, custom = {}) => {
        return {
          bsonType: "object",
          additionalProperties: false,
          ...handleCustom(custom),
          properties,
        };
      },
    };
  },
  documentBuilder: (schema) => {
    let validator = ajv.compile(schema);
    return (data) => {
      let cloned = cloneDeep(data);
      validator(cloned);
      return cloned;
    };
  },
};
