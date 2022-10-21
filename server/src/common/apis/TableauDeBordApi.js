const RateLimitedApi = require("./RateLimitedApi");
const { fetchStream } = require("../utils/httpUtils");
const { compose } = require("oleoduc");
const { streamNestedJsonArray } = require("../utils/streamUtils");

class TableauDeBordApi extends RateLimitedApi {
  constructor(options = {}) {
    super("TableauDeBordApi", { nbRequests: 5, perSeconds: 1, ...options });
  }

  static get baseApiUrl() {
    return "https://cfas.apprentissage.beta.gouv.fr/api";
  }

  async streamReseaux() {
    const response = await fetchStream(`${TableauDeBordApi.baseApiUrl}/referentiel/siret-uai-reseaux`);

    return compose(response, streamNestedJsonArray("organismes"));
  }
}

module.exports = TableauDeBordApi;
