const axios = require("axios");
const queryString = require("query-string");
const logger = require("../logger");
const RateLimitedApi = require("./RateLimitedApi");

class CatalogueApi extends RateLimitedApi {
  constructor(options = {}) {
    super("CatalogueApi", { nbRequests: 5, durationInSeconds: 1, ...options });
    this.client =
      options.axios ||
      axios.create({
        baseURL: "https://catalogue.apprentissage.beta.gouv.fr",
        timeout: 10000,
      });
  }

  getFormations(query, { annee, ...options }) {
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

      let version = `${annee || ""}`;
      logger.debug(`[${this.name}] Fetching formations ${version} with params ${params}...`);
      let response = await this.client.get(`api/entity/formations${version}?${params}`);
      return response.data;
    });
  }
}

module.exports = CatalogueApi;
