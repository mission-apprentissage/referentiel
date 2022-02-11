const { object, string, number, array } = require("./schemas/jsonSchemaTypes");

module.exports = {
  name: "communes",
  schema: () => {
    return object({
      _id: string(),
      geometry: object({
        type: string(),
        coordinates: array(),
      }),
      properties: object({
        codgeo: string(),
        libgeo: string(),
        dep: string(),
        reg: string(),
        xcl2154: number(),
        ycl2154: number(),
      }),
      type: string(),
    });
  },
};
