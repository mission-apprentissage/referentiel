const RateLimitedApi = require("./RateLimitedApi");
const { getFileAsStream, fetch } = require("../utils/httpUtils");
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
      let response = getFileAsStream(`${CatalogueApi.baseApiUrl}/entity/formations.json?${params}`, {
        highWaterMark: 1024 * 1024, //MiB
      });

      return compose(response, streamJsonArray());
    });
  }

  streamEtablissements(query, options) {
    return this.execute(async () => {
      let params = convertQueryIntoParams(query, options);

      let response = await getFileAsStream(`${CatalogueApi.baseApiUrl}/entity/etablissements.json?${params}`, {
        timeout: 5000,
      });

      return compose(response, streamJsonArray());
    });
  }

  getEtablissement(query, options) {
    return this.execute(async () => {
      let params = convertQueryIntoParams(query, options);

      let response = await fetch(`${CatalogueApi.baseApiUrl}/entity/etablissement?${params}`);

      return response.data;
    });
  }
}

module.exports = CatalogueApi;
