const { object, string } = require("./jsonSchemaTypes");
const geojsonSchema = require("./geojsonSchema");

const adresseSchema = () => {
  let required = ["code_postal", "code_insee", "localite", "region", "academie"];

  return object(
    {
      label: string(),
      code_postal: string(),
      code_insee: string(),
      localite: string(),
      region: object(
        {
          code: string(),
          nom: string(),
        },
        { required: ["code", "nom"] }
      ),
      academie: object(
        {
          code: string(),
          nom: string(),
        },
        { required: ["code", "nom"] }
      ),
      geojson: geojsonSchema,
    },
    { required }
  );
};

module.exports = adresseSchema();
