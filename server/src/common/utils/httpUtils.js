const miniget = require("miniget");
const axios = require("axios");
const logger = require("../logger").child({ context: "http" });

module.exports = {
  fetch,
  getFileAsStream,
  setCsvHeaders,
};

function setCsvHeaders(filename, res) {
  res.setHeader("Content-disposition", `attachment; filename=${filename}`);
  res.setHeader("Content-Type", `text/csv; charset=UTF-8`);
}

function getFileAsStream(url, options = {}) {
  logger.debug(`Téléchargement de ${url}...`);
  return miniget(url, options);
}

function fetch(url, options) {
  return axios.get(url, options);
}
