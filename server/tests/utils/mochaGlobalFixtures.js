const { stopMongod, dropDatabase, startMongod } = require("./mongoMemoryServer");

exports.mochaGlobalSetup = function () {
  return startMongod();
};

exports.mochaHooks = {
  afterEach: function () {
    return dropDatabase();
  },
};

exports.mochaGlobalTeardown = function () {
  return stopMongod();
};
