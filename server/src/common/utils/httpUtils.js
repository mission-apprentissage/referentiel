const axios = require("axios");
const streamWithFetch = require("node-fetch");
const { compose, transformData } = require("oleoduc");
const logger = require("../logger").child({ context: "http" });

class HTTPResponseError extends Error {
  constructor(response, ...args) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`, ...args);
    this.response = response;
  }
}

function addCsvHeaders(filename, encoding, res) {
  res.setHeader("Content-disposition", `attachment; filename=${filename}`);
  res.setHeader("Content-Type", `text/csv; charset=${encoding}`);
}

async function fetch(url, options = {}) {
  let { method = "GET", body, ...rest } = options;
  logger.debug(`${method} ${url}...`);

  const response = await streamWithFetch(url, {
    method,
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...rest,
  });

  if (response.ok) {
    return compose(
      response.body,
      transformData((d) => d.toString())
    );
  } else {
    throw new HTTPResponseError(response);
  }
}

function getUrl(url, options) {
  return axios.get(url, options);
}

module.exports = {
  getUrl,
  fetch,
  addCsvHeaders,
};
