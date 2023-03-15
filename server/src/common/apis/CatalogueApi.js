const RateLimitedApi = require("./RateLimitedApi");
const { fetchStream, fetchData } = require("../utils/httpUtils");
const { compose } = require("oleoduc");
const convertQueryIntoParams = require("./utils/convertQueryIntoParams");
const { streamJsonArray } = require("../utils/streamUtils");
const config = require("../../config");
const logger = require("../logger.js");

class CatalogueApi extends RateLimitedApi {
  constructor(options = {}) {
    super("CatalogueApi", { nbRequests: 5, perSeconds: 1, ...options });
    this.authCookie = null;
  }

  static get baseApiUrl() {
    return "https://catalogue.apprentissage.education.gouv.fr/api";
  }

  async login() {
    const response = await fetchData(`${CatalogueApi.baseApiUrl}/v1/auth/login`, {
      method: "POST",
      raw: true,
      data: {
        username: config.api.catalogue.username,
        password: config.api.catalogue.password,
      },
    });

    logger.info(`Le cookie d'authentification a été renouvelé`);
    this.authCookie = response.headers["set-cookie"].join(";");
  }

  isAuthenticated() {
    return !!this.authCookie;
  }

  streamFormations(query, options) {
    return this.execute(async () => {
      if (!this.isAuthenticated()) {
        await this.login();
      }

      const params = convertQueryIntoParams(query, options);
      const response = await fetchStream(`${CatalogueApi.baseApiUrl}/entity/formations.json?${params}`, {
        headers: { cookie: this.authCookie },
      });

      return compose(response, streamJsonArray());
    });
  }

  streamEtablissements(query, options) {
    return this.execute(async () => {
      if (!this.isAuthenticated()) {
        await this.login();
      }

      const params = convertQueryIntoParams(query, options);
      const response = await fetchStream(`${CatalogueApi.baseApiUrl}/entity/etablissements.json?${params}`, {
        headers: { cookie: this.authCookie },
      });

      return compose(response, streamJsonArray());
    });
  }

  getEtablissement(query, options) {
    return this.execute(async () => {
      if (!this.isAuthenticated()) {
        await this.login();
      }

      const params = convertQueryIntoParams(query, options);
      return fetchData(`${CatalogueApi.baseApiUrl}/entity/etablissement?${params}`, {
        headers: { cookie: this.authCookie },
      });
    });
  }
}

module.exports = CatalogueApi;
