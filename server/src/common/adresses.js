const { pick } = require("lodash");
const { findRegionByCodeInsee } = require("./regions");
const { findAcademieByCodeInsee } = require("./academies");
const caches = require("./caches/caches");
const { findDepartementByInsee } = require("./departements");
const { dbCollection } = require("./db/mongodb");
const logger = require("./logger");
const MIN_GEOCODE_SCORE = 0.5;

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

async function findCommune(codeInsee, codePostal, label) {
  const geojson = await dbCollection("communes").findOne(
    { "properties.codgeo": codeInsee },
    { projection: { _id: 0 } }
  );

  if (!geojson) {
    logger.warn(`Commune ${codeInsee} inconnue`);
    return null;
  }

  return buildAdresse({
    label: label,
    code_insee: codeInsee,
    code_postal: codePostal,
    localite: geojson.properties.libgeo,
    geojson: {
      type: geojson.type,
      geometry: geojson.geometry,
      properties: { source: "commune" },
    },
  });
}

async function selectBestResult(label, results, fallback) {
  const best = results.features[0];
  const newGeocodingError = async (message) => {
    const commune = fallback ? await findCommune(fallback.codeInsee, fallback.codePostal, label) : null;
    return new GeocodingError(message, { commune });
  };

  if (!best) {
    throw await newGeocodingError(`Pas de résultats pour l'adresse ${label}`);
  } else if (best.properties.score < MIN_GEOCODE_SCORE) {
    const coords = best.geometry.coordinates;
    throw await newGeocodingError(
      `Score ${best.properties.score} trop faible pour l'adresse ${label} (lon:${coords[0]},lat:${coords[1]})`
    );
  }

  let adresse_label = label;
  if (label.match(/^[0-9._]+$/)) {
    adresse_label = best.properties.label;
  }

  return buildAdresse({
    label: adresse_label,
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
  const cache = caches.geoAdresseApiCache();

  return {
    async geocode(adresse, options = {}) {
      const results = await cache.memo(adresse, async () => {
        return geoAdresseApi.search(adresse).catch((e) => {
          throw new GeocodingError(`Geocoding impossible pour l'adresse ${adresse}`, { cause: e });
        });
      });

      return selectBestResult(adresse, results, options.fallback);
    },
    async reverseGeocode(longitude, latitude) {
      const results = await cache.memo(`${longitude}_${latitude}`, async () => {
        return geoAdresseApi.reverse(longitude, latitude).catch((e) => {
          throw new GeocodingError(`Coordonnées inconnues [${longitude},${latitude}]`, { cause: e });
        });
      });

      return selectBestResult(`${longitude}_${latitude}`, results);
    },
  };
};
