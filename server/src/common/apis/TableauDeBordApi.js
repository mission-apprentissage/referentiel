const RateLimitedApi = require("./RateLimitedApi");
const { getFileAsStream } = require("../utils/httpUtils");
const Pick = require("stream-json/filters/Pick");
const { streamArray } = require("stream-json/streamers/StreamArray");
const { compose, transformData } = require("oleoduc");
const convertQueryIntoParams = require("./utils/convertQueryIntoParams");

class TableauDeBordApi extends RateLimitedApi {
  constructor(options = {}) {
    super("TableauDeBordApi", { nbRequests: 5, durationInSeconds: 1, ...options });
  }

  static get baseApiUrl() {
    return "https://cfas.apprentissage.beta.gouv.fr/api";
  }

  streamCfas(query, options) {
    let params = convertQueryIntoParams(query, options);

    let response = getFileAsStream(`${TableauDeBordApi.baseApiUrl}/cfas?${params}`);

    return compose(
      response,
      Pick.withParser({ filter: "cfas" }),
      streamArray(),
      transformData((data) => data.value)
    );
  }
}

module.exports = TableauDeBordApi;
