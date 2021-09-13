module.exports = {
  acce: (collection) => {
    return [collection.createIndex({ uai: 1 }, { unique: true }), collection.createIndex({ siret: 1 })];
  },
};
