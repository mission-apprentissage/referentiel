const axios = require("axios");
const queryString = require("query-string");
const logger = require("../logger");
const ApiError = require("./ApiError");
const RateLimitedApi = require("./RateLimitedApi");

class TcoApi extends RateLimitedApi {
  constructor(options = {}) {
    let client =
      options.axios ||
      axios.create({ baseURL: "https://tables-correspondances.apprentissage.beta.gouv.fr/api", timeout: 5000 });

    super("TcoApi", client, { nbRequests: 5, durationInSeconds: 1, ...options });
    this.client = client;
  }

  getEtablissements(query, options) {
    return this.execute(async (client) => {
      try {
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
        let response = await client.get(`/entity/etablissements?${params}`);
        return response.data;
      } catch (e) {
        throw new ApiError("Api Catalogue", e.message, e.code || e.response.status);
      }
    });
  }
}

module.exports = TcoApi;
