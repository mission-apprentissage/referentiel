const queryString = require("query-string");
const logger = require("../logger");
const RateLimitedApi = require("./RateLimitedApi");
const { getFileAsStream } = require("../utils/httpUtils");
const { compose, readLineByLine, transformData } = require("oleoduc");

class CatalogueApi extends RateLimitedApi {
  constructor(options = {}) {
    super("CatalogueApi", { nbRequests: 5, durationInSeconds: 1, ...options });
  }

  static get baseApiUrl() {
    return "https://catalogue.apprentissage.beta.gouv.fr/api";
  }

  streamFormations(query, options) {
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

    logger.debug(`[${this.name}] Fetching formations with params ${params}...`);
    let response = getFileAsStream(`${CatalogueApi.baseApiUrl}/entity/formations2021.ndjson?${params}`, {
      highWaterMark: 1048576 * 10, //MiB
    });

    return compose(
      response,
      readLineByLine(),
      transformData((data) => JSON.parse(data))
    );
  }

  streamEtablissements(query, options = {}) {
    return this.execute(async () => {
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

      logger.debug(`[${this.name}] Fetching etablissements with params ${params}...`);
      let response = await getFileAsStream(`${CatalogueApi.baseApiUrl}/entity/etablissements.ndjson?${params}`, {
        timeout: 5000,
      });

      return compose(
        response,
        readLineByLine(),
        transformData((data) => JSON.parse(data))
      );
    });
  }
}

module.exports = CatalogueApi;
