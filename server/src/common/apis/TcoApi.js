const queryString = require("query-string");
const logger = require("../logger");
const RateLimitedApi = require("./RateLimitedApi");
const got = require("got");

class TcoApi extends RateLimitedApi {
  constructor(options = {}) {
    super("TcoApi", { nbRequests: 5, durationInSeconds: 1, ...options });
  }

  static get baseApiUrl() {
    return "https://tables-correspondances-recette.apprentissage.beta.gouv.fr/api";
  }

  getEtablissements(query, options = {}) {
    return this.execute(async () => {
      let params = queryString.stringify(
        {
          query: JSON.stringify(query),
          ...Object.keys(options).reduce((acc, key) => {
            return {
              ...acc,
              [key]: JSON.stringify(options[key]),
            };
          }, {}),
        },
        { encode: false }
      );

      logger.debug(`[${this.name}] Fetching etablissements with params ${params}...`);
      return got.stream(`${TcoApi.baseApiUrl}/entity/etablissements.ndjson`, {
        searchParams: params,
        timeout: 5000,
        responseType: "json",
      });
    });
  }
}

module.exports = TcoApi;
