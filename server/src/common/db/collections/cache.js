module.exports = {
  name: "cache",
  indexes: () => {
    return [[{ expires_at: 1 }, { expireAfterSeconds: 0 }]];
  },
};
