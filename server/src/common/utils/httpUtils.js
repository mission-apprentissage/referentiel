const axios = require("axios");
const { compose } = require("oleoduc");
const logger = require("../logger").child({ context: "http" });
const http = require("http");
const https = require("https");
const { decodeStream } = require("iconv-lite");

class BufferedHttpAgent extends http.Agent {
  constructor({ highWaterMark = 16 * 1024, ...rest }) {
    super(rest);
    //see https://github.com/nodejs/node/issues/39092
    this.highWaterMark = highWaterMark;
  }

  createConnection(options, callback) {
    return super.createConnection({ ...options, highWaterMark: this.highWaterMark }, callback);
  }
}
class BufferedHttpsAgent extends https.Agent {
  constructor({ highWaterMark = 16 * 1024, ...rest }) {
    super(rest);
    //see https://github.com/nodejs/node/issues/39092
    this.highWaterMark = highWaterMark;
  }

  createConnection(options, callback) {
    return super.createConnection({ ...options, highWaterMark: this.highWaterMark }, callback);
  }
}

async function _fetch(url, options = {}) {
  const { method = "GET", data, highWaterMark, ...rest } = options;
  logger.debug(`${method} ${url}...`);

  return axios.request({
    url,
    method,
    httpAgent: new BufferedHttpAgent({ highWaterMark }),
    httpsAgent: new BufferedHttpsAgent({ highWaterMark }),
    ...(data ? { data } : {}),
    ...rest,
  });
}

async function fetchStream(url, options = {}) {
  const { raw, encoding = "UTF-8", ...rest } = options;
  const response = await _fetch(url, { responseType: "stream", ...rest });

  const stream = compose(response.data, decodeStream(encoding));

  if (raw) {
    return {
      headers: response.headers,
      stream,
    };
  } else {
    return stream;
  }
}

async function fetchData(url, options = {}) {
  const { raw, ...rest } = options;
  const response = await _fetch(url, { responseType: "json", ...rest });
  const data = response.data;

  if (raw) {
    return {
      headers: response.headers,
      data,
    };
  } else {
    return data;
  }
}

function addCsvHeaders(filename, encoding, res) {
  res.setHeader("Content-disposition", `attachment; filename=${filename}`);
  res.setHeader("Content-Type", `text/csv; charset=${encoding}`);
}

module.exports = {
  fetchStream,
  fetchData,
  addCsvHeaders,
};
