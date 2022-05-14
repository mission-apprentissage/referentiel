const { object, string, array, number } = require("./jsonSchemaTypes");

const geojsonSchema = () => {
  const required = ["type", "geometry"];

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
      properties: object({
        score: number(),
        source: string(),
      }),
    },
    { required }
  );
};

module.exports = geojsonSchema();
