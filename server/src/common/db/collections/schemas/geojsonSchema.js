const { object, string, arrayOf, number } = require("./jsonSchemaTypes");

const geojsonSchema = () => {
  let required = ["type", "geometry"];

  return object(
    {
      type: string(),
      geometry: object(
        {
          type: string(),
          coordinates: arrayOf(number()),
        },
        { required: ["type", "coordinates"] }
      ),
      properties: object({}, { additionalProperties: true }),
    },
    { required }
  );
};

module.exports = geojsonSchema();
