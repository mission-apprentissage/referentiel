const RateLimitedApi = require("./RateLimitedApi");
const { fetch, getUrl } = require("../utils/httpUtils");
const { compose, readLineByLine, transformData } = require("oleoduc");
const convertQueryIntoParams = require("./utils/convertQueryIntoParams");

class CatalogueApi extends RateLimitedApi {
  constructor(options = {}) {
    super("CatalogueApi", { nbRequests: 5, durationInSeconds: 1, ...options });
  }

  static get baseApiUrl() {
    return "https://catalogue.apprentissage.beta.gouv.fr/api";
  }

  async streamFormations(query, options) {
    let params = convertQueryIntoParams(query, options);
    let response = await fetch(`${CatalogueApi.baseApiUrl}/entity/formations.ndjson?${params}`);

    return compose(
      response,
      readLineByLine(),
      transformData((data) => JSON.parse(data))
    );
  }
  streamEtablissements(query, options) {
    return this.execute(async () => {
      let params = convertQueryIntoParams(query, options);

      let response = await fetch(`${CatalogueApi.baseApiUrl}/entity/etablissements.ndjson?${params}`);

      return compose(
        response,
        readLineByLine(),
        transformData((data) => (data ? JSON.parse(data) : data))
      );
    });
  }
  getEtablissement(query, options) {
    return this.execute(async () => {
      let params = convertQueryIntoParams(query, options);

      let response = await getUrl(`${CatalogueApi.baseApiUrl}/entity/etablissement?${params}`);

      return response.data;
    });
  }
}

module.exports = CatalogueApi;
