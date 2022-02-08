const { object, string, array } = require("./jsonSchemaTypes");

const geojsonSchema = () => {
  let required = ["type", "geometry"];

  return object(
    {
      type: string(),
      geometry: object(
        {
          type: string(),
          coordinates: array(),
        },
        { required: ["type", "coordinates"] }
      ),
      properties: object({}, { additionalProperties: true }),
    },
    { required }
  );
};

module.exports = geojsonSchema();
