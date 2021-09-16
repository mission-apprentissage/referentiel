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
  createIndexes: (dbCollection) => {
    return dbCollection.createIndex({ FORMATION_DIPLOME: 1 });
  },
};
