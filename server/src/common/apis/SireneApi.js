const axios = require("axios");
const RateLimitedApi = require("./RateLimitedApi");
const logger = require("../logger").child({ context: "SireneApi" });

class SireneApi extends RateLimitedApi {
  constructor(options = {}) {
    super("SireneApi", { nbRequests: 2, durationInSeconds: 1, ...options });
    this.client = options.axios || axios.create({ timeout: 10000 });
  }

  static get baseApiUrl() {
    return "https://entreprise.data.gouv.fr/api/sirene/v3";
  }

  getUniteLegale(siren) {
    return this.execute(async () => {
      logger.debug(`Fetch de l'unité légale ${siren}...`);
      let response = await this.client.get(`${SireneApi.baseApiUrl}/unites_legales/${siren}`);
      return response.data.unite_legale;
    });
  }

  getEtablissement(siret) {
    return this.execute(async () => {
      logger.debug(`Fetch de l'établissement ${siret}...`);
      let response = await this.client.get(`${SireneApi.baseApiUrl}/etablissements/${siret}`);

      return response.data.etablissement;
    });
  }
}

module.exports = SireneApi;
