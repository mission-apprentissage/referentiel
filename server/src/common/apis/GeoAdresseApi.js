const axios = require("axios");
const queryString = require("query-string");
const logger = require("../logger").child({ context: "GeoAdresseApi" });
const RateLimitedApi = require("./RateLimitedApi");

class GeoAdresseApi extends RateLimitedApi {
  constructor(options = {}) {
    super("GeoAdresseApi", { nbRequests: 25, durationInSeconds: 1, ...options });
    this.client = options.axios || axios.create({ timeout: 5000 });
  }

  static get baseApiUrl() {
    return "https://api-adresse.data.gouv.fr";
  }

  async search(q, options = {}) {
    return this.execute(async () => {
      let params = queryString.stringify({ q, ...options });
      logger.debug(`Searching adresse with parameters ${params}...`);
      const response = await this.client.get(`${GeoAdresseApi.baseApiUrl}/search?${params}`);
      return response.data;
    });
  }

  async reverse(lon, lat, options = {}) {
    return this.execute(async () => {
      let params = queryString.stringify({ lon, lat, ...options });
      logger.debug(`Reverse geocode with parameters ${params}...`);
      const response = await this.client.get(`${GeoAdresseApi.baseApiUrl}/reverse?${params}`);
      return response.data;
    });
  }
}

module.exports = GeoAdresseApi;
