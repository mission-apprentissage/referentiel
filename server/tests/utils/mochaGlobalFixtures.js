const { stopMongod, removeAll, startMongod } = require("./mongoMemoryServer");

exports.mochaGlobalSetup = function () {
  return startMongod();
};

exports.mochaHooks = {
  afterEach: async function () {
    return removeAll();
  },
};

exports.mochaGlobalTeardown = function () {
  return stopMongod();
};
