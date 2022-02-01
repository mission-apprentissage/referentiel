const miniget = require("miniget");
const logger = require("../logger").child({ context: "http" });

module.exports = {
  getFileAsStream: (url, options = {}) => {
    logger.debug(`Téléchargement de ${url}...`);
    return miniget(url, options);
  },
};
