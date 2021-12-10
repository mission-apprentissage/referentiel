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
    this.message = message;
    this.cause = cause;
  }
}

function selectBestResult(results, desc) {
  let best = results.features[0];
  if (!best || best.properties.score < MIN_GEOCODE_SCORE) {
    throw new GeocodingError(
      `Score ${best?.properties.score} trop faible pour l'adresse ${desc} / ${best.geometry.coordinates}`
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

module.exports = (geoAdresseApi) => {
  let cache = caches.geoAdresseApiCache();

  function geocode(adresse, { longitude, latitude }) {
    return cache.memo(adresse, async () => {
      return geoAdresseApi.search(adresse).catch((e) => {
        throw new GeocodingError(`[${longitude},${latitude}]`, e);
      });
    });
  }

  function reverse(longitude, latitude, options) {
    return cache.memo(`${longitude}_${latitude}`, () => {
      return geoAdresseApi.reverse(longitude, latitude).catch((error) => {
        if (!options.adresse) {
          throw new GeocodingError(`Coordonnées inconnues [${longitude},${latitude}]`, error);
        }
        return geocode(options.adresse, { longitude, latitude });
      });
    });
  }

  return {
    async getAdresseFromCoordinates(longitude, latitude, options = {}) {
      let results = await reverse(longitude, latitude, options);
      let best = selectBestResult(results, { longitude, latitude });
      if (
        options.adresse &&
        options.code_postal &&
        best.code_postal.substr(0, 2) !== options.code_postal.substr(0, 2)
      ) {
        let geocoded = await geocode(options.adresse, { longitude, latitude });
        best = selectBestResult(geocoded, options.adresse);
      }
      return best;
    },
  };
};
