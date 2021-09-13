const { omit, merge } = require("lodash");
const jsonSchemaDefaults = require("json-schema-defaults");

function createKeywordsMapper(options = {}) {
  if (options.bson) {
    return (keywords) => omit(keywords, ["$ref", "$schema", "default", "definitions", "format", "id"]);
  }

  return (keywords) => {
    if (["int", "long"].includes(keywords.bsonType)) {
      keywords.type = "number";
    } else if (keywords.bsonType === "objectId" || keywords.bsonType === "date") {
      keywords.type = "string";
    } else {
      keywords.type = keywords.bsonType;
    }

    delete keywords.bsonType;
    return keywords;
  };
}
module.exports = {
  jsonSchemaTypes: (options = {}) => {
    let mapKeywords = createKeywordsMapper(options);

    return {
      number: (custom = {}) => mapKeywords({ bsonType: "number", ...custom }),
      integer: (custom = {}) => mapKeywords({ bsonType: "int", ...custom }),
      objectId: (custom = {}) => mapKeywords({ bsonType: "objectId", ...custom }),
      string: (custom = {}) => mapKeywords({ bsonType: "string", ...custom }),
      date: (custom = {}) => mapKeywords({ bsonType: "date", ...custom }),
      arrayOf: (items, custom = {}) => {
        return mapKeywords({
          bsonType: "array",
          ...(options.bson ? {} : { default: [] }),
          ...custom,
          items,
        });
      },
      object: (properties, custom = {}) => {
        return mapKeywords({
          bsonType: "object",
          additionalProperties: false,
          ...custom,
          properties,
        });
      },
    };
  },
  withDefaultsBuilder: (schema) => {
    return (data) => {
      return merge({}, jsonSchemaDefaults(schema), data);
    };
  },
};
