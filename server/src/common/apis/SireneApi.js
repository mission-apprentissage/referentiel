const axios = require("axios");
const queryString = require("query-string");
const config = require("../../config");
const RateLimitedApi = require("./RateLimitedApi");
const { fetchStream } = require("../utils/httpUtils.js");
const { compose } = require("oleoduc");
const { streamNestedJsonArray, concatStreams } = require("../utils/streamUtils.js");
const logger = require("../logger").child({ context: "SireneApi" });

class SireneApi extends RateLimitedApi {
  constructor(options = {}) {
    super("SireneApi", { nbRequests: 1, perSeconds: 2, ...options });
    this.client = options.axios || axios.create({ timeout: 10000 });
    this.token_timeout = options.token_timeout || 86400; //24 hours
    this.credentials = null;
  }

  static get baseApiUrl() {
    return "https://api.insee.fr/api-sirene/3.11";
  }

  getNextCursor(headers) {
    const cursorLink = headers.link?.split(",").find((s) => s.indexOf('rel="next"') !== -1);
    return cursorLink?.match(/curseur=(.*)>;/)?.[1];
  }

  streamEtablissements(query, options = {}) {
    return this.execute(async () => {
      let cursor = "*";
      return concatStreams(async () => {
        if (!cursor) {
          return null;
        }

        logger.debug(`Récupération des établissements`, { cursor, query });
        const { headers, stream } = await fetchStream(`${SireneApi.baseApiUrl}/siret`, {
          raw: true,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-INSEE-Api-Key-Integration": `${config.sirene.api.consumerKey}`,
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
