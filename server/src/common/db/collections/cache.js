module.exports = {
  name: "cache",
  createIndexes: (dbCollection) => {
    return dbCollection.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });
  },
};
