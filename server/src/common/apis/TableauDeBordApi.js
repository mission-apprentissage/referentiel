const queryString = require("query-string");
const logger = require("../logger");
const RateLimitedApi = require("./RateLimitedApi");
const { getFileAsStream } = require("../utils/httpUtils");
const Pick = require("stream-json/filters/Pick");
const { streamArray } = require("stream-json/streamers/StreamArray");
const { compose, transformData } = require("oleoduc");

class TableauDeBordApi extends RateLimitedApi {
  constructor(options = {}) {
    super("CatalogueApi", { nbRequests: 5, durationInSeconds: 1, ...options });
  }

  static get baseApiUrl() {
    return "https://cfas.apprentissage.beta.gouv.fr/api";
  }

  streamCfas(query, options) {
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

    logger.debug(`[${this.name}] Fetching CFA with params ${params}...`);
    let response = getFileAsStream(`${TableauDeBordApi.baseApiUrl}/cfas?${params}`);

    return compose(
      response,
      Pick.withParser({ filter: "cfas" }),
      streamArray(),
      transformData((data) => data.value)
    );
  }
}

module.exports = TableauDeBordApi;
