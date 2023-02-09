const RateLimitedApi = require("./RateLimitedApi");
const { fetchStream } = require("../utils/httpUtils");
const { compose } = require("oleoduc");
const { streamNestedJsonArray } = require("../utils/streamUtils");
const config = require("../../config");

class TableauDeBordApi extends RateLimitedApi {
  constructor(options = {}) {
    super("TableauDeBordApi", { nbRequests: 5, perSeconds: 1, ...options });
  }

  static get baseApiUrl() {
    return "https://cfas.apprentissage.beta.gouv.fr/api";
  }

  async streamReseaux(limit = 100000) {
    const response = await fetchStream(`${TableauDeBordApi.baseApiUrl}/organismes?limit=${limit}`, {
      method: "POST",
      insecureHTTPParser: true,
      data: {
        apiKey: config.api.tableauDeBordApiKey,
      },
    });

    return compose(response, streamNestedJsonArray("organismes"));
  }
}

module.exports = TableauDeBordApi;
