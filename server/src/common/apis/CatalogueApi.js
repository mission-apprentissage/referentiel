const queryString = require("query-string");
const logger = require("../logger");
const RateLimitedApi = require("./RateLimitedApi");
const { getFileAsStream } = require("../utils/httpUtils");
const { oleoduc, readLineByLine, transformData } = require("oleoduc");

class CatalogueApi extends RateLimitedApi {
  constructor(options = {}) {
    super("CatalogueApi", { nbRequests: 5, durationInSeconds: 1, ...options });
  }

  static get baseApiUrl() {
    return "https://catalogue.apprentissage.beta.gouv.fr/api";
  }

  streamFormations(query, { annee, ...options }) {
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
    let response = getFileAsStream(`${CatalogueApi.baseApiUrl}/entity/formations${version}.ndjson?${params}`, {
      highWaterMark: 1048576 * 25, // 25MiB
    });

    return oleoduc(
      response,
      readLineByLine(),
      transformData((data) => JSON.parse(data)),
      { promisify: false }
    );
  }
}

module.exports = CatalogueApi;
