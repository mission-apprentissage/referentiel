const miniget = require("miniget");
const logger = require("../logger");

module.exports = {
  getFileAsStream: (url, options = {}) => {
    logger.info(`Downloading ${url}...`);
    return miniget(url, options);
  },
};
