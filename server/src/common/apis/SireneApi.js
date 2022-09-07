const axios = require("axios");
const queryString = require("query-string");
const config = require("../../config");
const RateLimitedApi = require("./RateLimitedApi");
const { fetchData, fetchStream } = require("../utils/httpUtils.js");
const { compose } = require("oleoduc");
const { streamNestedJsonArray, concatStreams } = require("../utils/streamUtils.js");
const { encodeToBase64 } = require("../utils/stringUtils.js");
const logger = require("../logger").child({ context: "SireneApi" });

class SireneApi extends RateLimitedApi {
  constructor(options = {}) {
    super("SireneApi", { nbRequests: 1, perSeconds: 2, ...options });
    this.client = options.axios || axios.create({ timeout: 10000 });
    this.token_timeout = options.token_timeout || 86400; //24 hours
    this.credentials = null;
  }

  static get baseApiUrl() {
    return "https://api.insee.fr";
  }

  async login() {
    const data = await fetchData(`${SireneApi.baseApiUrl}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${encodeToBase64(
          `${config.sirene.api.consumerKey}:${config.sirene.api.consumerSecret}`
        )}`,
      },
      data: queryString.stringify({
        grant_type: "client_credentials",
        validity_period: 3600, //1 heure
      }),
    });

    logger.info(`Le token d'authentification a été renouvelé`);
    this.credentials = {
      token: data.access_token,
      timestamp: Date.now(),
    };
  }

  isAuthenticated() {
    return !!this.credentials;
  }

  isAccessTokenExpired() {
    return !this.credentials || this.token_timeout < Date.now() - this.credentials.timestamp;
  }

  getNextCursor(headers) {
    const cursorLink = headers.link?.split(",").find((s) => s.indexOf('rel="next"') !== -1);
    return cursorLink?.match(/curseur=(.*)>;/)?.[1];
  }

  streamEtablissements(query, options = {}) {
    return this.execute(async () => {
      if (!this.isAuthenticated() || this.isAccessTokenExpired()) {
        await this.login();
      }

      let cursor = "*";
      return concatStreams(async () => {
        if (!cursor) {
          return null;
        }

        logger.debug(`Récupération des établissements`, { cursor, query });
        const { headers, stream } = await fetchStream(`${SireneApi.baseApiUrl}/entreprises/sirene/V3/siret`, {
          raw: true,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${this.credentials.token}`,
          },
          data: queryString.stringify({ ...options, q: query, curseur: cursor }),
        });

        cursor = this.getNextCursor(headers);
        return compose(stream, streamNestedJsonArray("etablissements"));
      });
    });
  }
}

module.exports = SireneApi;
