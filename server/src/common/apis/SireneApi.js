const axios = require("axios");
const logger = require("../logger");
const RateLimitedApi = require("./RateLimitedApi");

class SireneApi extends RateLimitedApi {
  constructor(options = {}) {
    super("SireneApi", { nbRequests: 4, durationInSeconds: 1, ...options });
    this.client = options.axios || axios.create({ timeout: 5000 });
  }

  static get baseApiUrl() {
    return "https://entreprise.data.gouv.fr/api/sirene/v3";
  }

  getUniteLegale(siren) {
    return this.execute(async () => {
      logger.debug(`[${this.name}] Fetching unites_legales for siren ${siren}...`);
      let response = await this.client.get(`${SireneApi.baseApiUrl}/unites_legales/${siren}`);
      return response.data.unite_legale;
    });
  }

  getEtablissement(siret) {
    return this.execute(async () => {
      logger.debug(`[${this.name}] Fetching etablissement ${siret}...`);
      let response = await this.client.get(`${SireneApi.baseApiUrl}/etablissements/${siret}`);

      return response.data.etablissement;
    });
  }
}

module.exports = SireneApi;
