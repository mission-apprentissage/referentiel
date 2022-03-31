const miniget = require("miniget");
const axios = require("axios");
const logger = require("../logger").child({ context: "http" });

module.exports = {
  fetch,
  getFileAsStream,
  addCsvHeaders,
};

function addCsvHeaders(filename, encoding, res) {
  res.setHeader("Content-disposition", `attachment; filename=${filename}`);
  res.setHeader("Content-Type", `text/csv; charset=${encoding}`);
}

function getFileAsStream(url, options = {}) {
  logger.debug(`Téléchargement de ${url}...`);
  return miniget(url, options);
}

function fetch(url, options) {
  return axios.get(url, options);
}
