const got = require("got");

module.exports = {
  getFileAsStream(url, options) {
    return got.stream(url, options);
  },
};
