const { pick } = require("lodash");
const { findRegionByName } = require("./regions");
const { findAcademieByCodeInsee } = require("./academies");
const caches = require("./caches/caches");
const { findDepartementByInsee } = require("./departements");
const MIN_GEOCODE_SCORE = 0.6;

class GeocodingError extends Error {
  constructor(message, cause) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = `Adresse inconnue ${message}`;
    this.cause = cause;
  }
}

function selectBestResults(results, adresse) {
  let best = results.features[0];
  if (!best || best.properties.score < MIN_GEOCODE_SCORE) {
    throw new GeocodingError(`Score trop faible pour l'adresse ${adresse}`);
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

module.exports = (geoAdresseApi) => {
  let cache = caches.geoAdresseApiCache();

  async function reverseGeocodingFallback(error, longitude, latitude, label) {
    let promise = label ? geoAdresseApi.search(label) : Promise.reject(error);

    return promise.catch((e) => {
      throw new GeocodingError(`[${longitude},${latitude}]`, e);
    });
  }

  return {
    async getAdresseFromCoordinates(longitude, latitude, options = {}) {
      let key = `${longitude}_${latitude}`;
      let results = await cache.memo(key, () => {
        return geoAdresseApi
          .reverse(longitude, latitude)
          .catch((e) => reverseGeocodingFallback(e, longitude, latitude, options.label));
      });

      return selectBestResults(results, `[${longitude},${latitude}]`);
    },
  };
};
