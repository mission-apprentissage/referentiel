const RateLimitedApi = require("./RateLimitedApi");
const { fetchStream, fetchJson } = require("../utils/httpUtils");
const { compose } = require("oleoduc");
const convertQueryIntoParams = require("./utils/convertQueryIntoParams");
const { streamJsonArray } = require("../utils/streamUtils");

class CatalogueApi extends RateLimitedApi {
  constructor(options = {}) {
    super("CatalogueApi", { nbRequests: 5, durationInSeconds: 1, ...options });
  }

  static get baseApiUrl() {
    return "https://catalogue.apprentissage.beta.gouv.fr/api";
  }

  streamFormations(query, options) {
    return this.execute(async () => {
      let params = convertQueryIntoParams(query, options);
      let response = await fetchStream(`${CatalogueApi.baseApiUrl}/entity/formations.json?${params}`);

      return compose(response, streamJsonArray());
    });
  }

  streamEtablissements(query, options) {
    return this.execute(async () => {
      let params = convertQueryIntoParams(query, options);

      let response = await fetchStream(`${CatalogueApi.baseApiUrl}/entity/etablissements.json?${params}`);

      return compose(response, streamJsonArray());
    });
  }

  getEtablissement(query, options) {
    return this.execute(async () => {
      let params = convertQueryIntoParams(query, options);

      return fetchJson(`${CatalogueApi.baseApiUrl}/entity/etablissement?${params}`);
    });
  }
}

module.exports = CatalogueApi;
