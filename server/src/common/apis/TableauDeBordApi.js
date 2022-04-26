const RateLimitedApi = require("./RateLimitedApi");
const { getFileAsStream } = require("../utils/httpUtils");
const { compose } = require("oleoduc");
const convertQueryIntoParams = require("./utils/convertQueryIntoParams");
const { streamNestedJsonArray } = require("../utils/streamUtils");

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

    return compose(response, streamNestedJsonArray("cfas"));
  }
}

module.exports = TableauDeBordApi;
