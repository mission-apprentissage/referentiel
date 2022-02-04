const { pick } = require("lodash");
const { findRegionByName } = require("./regions");
const { findAcademieByCodeInsee } = require("./academies");
const caches = require("./caches/caches");
const { findDepartementByInsee } = require("./departements");
const MIN_GEOCODE_SCORE = 0.6;

class GeocodingError extends Error {
  constructor(message, options = {}) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    if (options.original) {
      this.message += ` (original: ${JSON.stringify(options.original)})`;
    }
    if (options.cause) {
      this.message += ` (cause: ${options.cause.message})`;
    }
    this.cause = options.cause;
  }
}

module.exports = (geoAdresseApi) => {
  let cache = caches.geoAdresseApiCache();

  function selectBestResult(results, original) {
    let best = results.features[0];

    if (!best) {
      throw new GeocodingError(`Pas de résultats pour l'adresse ${JSON.stringify(original)}`);
    } else if (best.properties.score < MIN_GEOCODE_SCORE) {
      throw new GeocodingError(
        `Score ${best.properties.score} trop faible pour l'adresse ${JSON.stringify(original)} / ${
          best.geometry.coordinates
        }`
      );
    }

    let properties = best.properties;
    let context = properties.context.split(",");
    let regionName = context[context.length - 1].trim();
    let codeInsee = properties.citycode;

    return {
      label: properties.label,
      code_postal: properties.postcode,
      code_insee: codeInsee,
      localite: properties.city,
      departement: pick(findDepartementByInsee(codeInsee), ["code", "nom"]),
      region: pick(findRegionByName(regionName), ["code", "nom"]),
      academie: pick(findAcademieByCodeInsee(codeInsee), ["code", "nom"]),
      geojson: {
        type: best.type,
        geometry: best.geometry,
        properties: {
          score: properties.score,
        },
      },
    };
  }

  function search(adresse) {
    return cache.memo(adresse, async () => {
      return geoAdresseApi.search(adresse).catch((e) => {
        throw new GeocodingError(`Geocoding impossible pour l'adresse ${adresse}`, { cause: e });
      });
    });
  }

  function reverse(longitude, latitude) {
    return cache.memo(`${longitude}_${latitude}`, async () => {
      return geoAdresseApi.reverse(longitude, latitude).catch((e) => {
        throw new GeocodingError(`Coordonnées inconnues [${longitude},${latitude}]`, { cause: e });
      });
    });
  }

  return {
    async geocode(adresse) {
      let results = await search(adresse);
      return selectBestResult(results, adresse);
    },
    async reverseGeocode(longitude, latitude) {
      let results = await reverse(longitude, latitude);
      return selectBestResult(results, { longitude, latitude });
    },
  };
};
