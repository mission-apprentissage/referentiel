const { object, objectId, string } = require("./schemas/jsonSchemaTypes");

module.exports = {
  name: "acce",
  schema: () => {
    const required = ["numero_uai"];

    return object(
      {
        _id: objectId(),
        numero_uai: string(),
        nature_uai: string(),
        nature_uai_libe: string(),
        etat_etablissement: string(),
        etat_etablissement_libe: string(),
        mel_uai: string(),
      },
      { required }
    );
  },
  indexes: () => {
    return [[{ numero_uai: 1 }, { unique: true }]];
  },
};
