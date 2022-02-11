const RateLimitedApi = require("./RateLimitedApi");
const { getFileAsStream, fetch } = require("../utils/httpUtils");
const { compose, readLineByLine, transformData } = require("oleoduc");
const convertQueryIntoParams = require("./utils/convertQueryIntoParams");

class CatalogueApi extends RateLimitedApi {
  constructor(options = {}) {
    super("CatalogueApi", { nbRequests: 5, durationInSeconds: 1, ...options });
  }

  static get baseApiUrl() {
    return "https://catalogue.apprentissage.beta.gouv.fr/api";
  }

  streamFormations(query, options) {
    let params = convertQueryIntoParams(query, options);
    let response = getFileAsStream(`${CatalogueApi.baseApiUrl}/entity/formations.ndjson?${params}`, {
      highWaterMark: 1048576 * 10, //MiB
    });

    return compose(
      response,
      readLineByLine(),
      transformData((data) => JSON.parse(data))
    );
  }
  streamEtablissements(query, options) {
    return this.execute(async () => {
      let params = convertQueryIntoParams(query, options);

      let response = await getFileAsStream(`${CatalogueApi.baseApiUrl}/entity/etablissements.ndjson?${params}`, {
        timeout: 5000,
      });

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

      let response = await fetch(`${CatalogueApi.baseApiUrl}/entity/etablissement?${params}`);

      return response.data;
    });
  }
}

module.exports = CatalogueApi;
