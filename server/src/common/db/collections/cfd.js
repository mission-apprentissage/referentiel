const { object, objectId, string } = require("./schemas/jsonSchemaTypes");

module.exports = {
  name: "cfd",
  schema: () => {
    return object(
      {
        _id: objectId(),
        FORMATION_DIPLOME: string(),
        NIVEAU_FORMATION_DIPLOME: string(),
        LIBELLE_COURT: string(),
      },
      { required: ["FORMATION_DIPLOME", "NIVEAU_FORMATION_DIPLOME", "LIBELLE_COURT"] }
    );
  },
  indexes: () => {
    return [[{ FORMATION_DIPLOME: 1 }]];
  },
};
