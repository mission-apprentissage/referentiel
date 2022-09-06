const RateLimitedApi = require("./RateLimitedApi");
const { fetchStream } = require("../utils/httpUtils");
const { compose } = require("oleoduc");
const convertQueryIntoParams = require("./utils/convertQueryIntoParams");
const { streamNestedJsonArray } = require("../utils/streamUtils");

class TableauDeBordApi extends RateLimitedApi {
  constructor(options = {}) {
    super("TableauDeBordApi", { nbRequests: 5, perSeconds: 1, ...options });
  }

  static get baseApiUrl() {
    return "https://cfas.apprentissage.beta.gouv.fr/api";
  }

  async streamCfas(query, options) {
    const params = convertQueryIntoParams(query, options);

    const response = await fetchStream(`${TableauDeBordApi.baseApiUrl}/cfas?${params}`);

    return compose(response, streamNestedJsonArray("cfas"));
  }
}

module.exports = TableauDeBordApi;
