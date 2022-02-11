const { pick } = require("lodash");
const { findRegionByCodeInsee } = require("./regions");
const { findAcademieByCodeInsee } = require("./academies");
const caches = require("./caches/caches");
const { findDepartementByInsee } = require("./departements");
const { dbCollection } = require("./db/mongodb");
const logger = require("./logger");
const MIN_GEOCODE_SCORE = 0.6;

class GeocodingError extends Error {
  constructor(message, options = {}) {
    super(message, options);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.cause = options.cause;
    this.commune = options.commune;
    this.message = message;
    if (this.cause) {
      this.message += ` (cause: ${this.cause.message})`;
    }
  }
}

async function findCommune(label, fallback) {
  let geojson = await dbCollection("communes").findOne(
    { "properties.codgeo": fallback.codeInsee },
    { projection: { _id: 0 } }
  );

  if (!geojson) {
    logger.warn(`Commune ${fallback.codeInsee} inconnue`);
    return null;
  }

  return buildAdresse({
    label,
    code_postal: fallback.codePostal,
    code_insee: fallback.codeInsee,
    localite: geojson.properties.libgeo,
    geojson: {
      type: geojson.type,
      geometry: geojson.geometry,
      properties: { source: "commune" },
    },
  });
}

async function selectBestResult(label, results, fallback) {
  let best = results.features[0];
  let newGeocodingError = async (message) => {
    let commune = fallback ? await findCommune(label, fallback) : null;
    return new GeocodingError(message, { commune });
  };

  if (!best) {
    throw await newGeocodingError(`Pas de résultats pour l'adresse ${label}`);
  } else if (best.properties.score < MIN_GEOCODE_SCORE) {
    throw await newGeocodingError(
      `Score ${best.properties.score} trop faible pour l'adresse ${label} / ${best.geometry.coordinates}`
    );
  }

  return buildAdresse({
    label: best.properties.label,
    code_postal: best.properties.postcode,
    code_insee: best.properties.citycode,
    localite: best.properties.city,
    geojson: {
      type: best.type,
      geometry: best.geometry,
      properties: { score: best.properties.score, source: "geo-adresse-api" },
    },
  });
}

function buildAdresse(data) {
  return {
    ...data,
    departement: pick(findDepartementByInsee(data.code_insee), ["code", "nom"]),
    region: pick(findRegionByCodeInsee(data.code_insee), ["code", "nom"]),
    academie: pick(findAcademieByCodeInsee(data.code_insee), ["code", "nom"]),
  };
}

module.exports = (geoAdresseApi) => {
  let cache = caches.geoAdresseApiCache();

  return {
    async geocode(adresse, options = {}) {
      let results = await cache.memo(adresse, async () => {
        return geoAdresseApi.search(adresse).catch((e) => {
          throw new GeocodingError(`Geocoding impossible pour l'adresse ${adresse}`, { cause: e });
        });
      });

      return selectBestResult(adresse, results, options.fallback);
    },
    async reverseGeocode(longitude, latitude) {
      let results = await cache.memo(`${longitude}_${latitude}`, async () => {
        return geoAdresseApi.reverse(longitude, latitude).catch((e) => {
          throw new GeocodingError(`Coordonnées inconnues [${longitude},${latitude}]`, { cause: e });
        });
      });

      return selectBestResult(`${longitude}_${latitude}`, results);
    },
  };
};
