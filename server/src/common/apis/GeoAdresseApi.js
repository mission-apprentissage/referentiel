const axios = require("axios");
const queryString = require("query-string");
const logger = require("../logger");
const RateLimitedApi = require("./RateLimitedApi");

class GeoAdresseApi extends RateLimitedApi {
  constructor(options = {}) {
    super("GeoAdresseApi", { nbRequests: 25, durationInSeconds: 1, ...options });
    this.client = options.axios || axios.create({ baseURL: "https://api-adresse.data.gouv.fr", timeout: 5000 });
  }

  async search(q, options = {}) {
    return this.execute(async () => {
      let params = queryString.stringify({ q, ...options });
      logger.debug(`[${this.name}] Searching adresse with parameters ${params}...`);
      const response = await this.client.get(`search/?${params}`);
      return response.data;
    });
  }

  async reverse(lon, lat, options = {}) {
    return this.execute(async () => {
      let params = queryString.stringify({ lon, lat, ...options });
      logger.debug(`[${this.name}] Reverse geocode with parameters ${params}...`);
      const response = await this.client.get(`reverse/?${params}`);
      return response.data;
    });
  }

  async searchMunicipalityByCode(code, options = {}) {
    return this.execute(async () => {
      let query = `${options.isCityCode ? "citycode=" : ""}${code}`;
      if (options.codeInsee) {
        query = `${code}&citycode=${options.codeInsee}`;
      }
      logger.debug(`[${this.name}] Searching municipality with query ${query}...`);
      const response = await this.client.get(`search/?limit=1&q=${query}&type=municipality`);
      return response.data;
    });
  }
}

module.exports = GeoAdresseApi;
