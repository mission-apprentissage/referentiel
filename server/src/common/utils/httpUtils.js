const miniget = require("miniget");

module.exports = {
  getFileAsStream: (url, options = {}) => {
    return miniget(url, options);
  },
};
