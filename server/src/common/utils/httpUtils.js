const miniget = require("miniget");
const axios = require("axios");
const logger = require("../logger").child({ context: "http" });

module.exports = {
  fetch: (url, options) => axios.get(url, options),
  getFileAsStream: (url, options = {}) => {
    logger.debug(`Téléchargement de ${url}...`);
    return miniget(url, options);
  },
};
