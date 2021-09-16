const axios = require("axios");
const queryString = require("query-string");
const logger = require("../logger");
const ApiError = require("./ApiError");
const RateLimitedApi = require("./RateLimitedApi");

class GeoAdresseApi extends RateLimitedApi {
  constructor(options = {}) {
    let client = options.axios || axios.create({ baseURL: "https://api-adresse.data.gouv.fr", timeout: 5000 });

    super("GeoAdresseApi", client, { nbRequests: 25, durationInSeconds: 1, ...options });
    this.client = client;
  }

  async search(q, options = {}) {
    return this.execute(async (client) => {
      try {
        let params = queryString.stringify({ q, ...options });
        logger.debug(`[Adresse API] Searching adresse with parameters ${params}...`);
        const response = await client.get(`search/?${params}`);
        return response.data;
      } catch (e) {
        throw new ApiError("geoAdresseApi", e.message, e.code || e.response.status);
      }
    });
  }

  async reverse(lon, lat, options = {}) {
    return this.execute(async (client) => {
      try {
        let params = queryString.stringify({ lon, lat, ...options });
        logger.debug(`[Adresse API] Reverse geocode with parameters ${params}...`);
        const response = await client.get(`reverse/?${params}`);
        return response.data;
      } catch (e) {
        throw new ApiError("geoAdresseApi", e.message, e.code || e.response.status);
      }
    });
  }

  async searchMunicipalityByCode(code, options = {}) {
    return this.execute(async (client) => {
      try {
        let query = `${options.isCityCode ? "citycode=" : ""}${code}`;
        if (options.codeInsee) {
          query = `${code}&citycode=${options.codeInsee}`;
        }
        logger.debug(`[Adresse API] Searching municipality with query ${query}...`);
        const response = await client.get(`search/?limit=1&q=${query}&type=municipality`);
        return response.data;
      } catch (e) {
        throw new ApiError("geoAdresseApi", e.message, e.code || e.response.status);
      }
    });
  }
}

module.exports = GeoAdresseApi;
