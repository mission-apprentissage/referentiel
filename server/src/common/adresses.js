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
    this.fallback = options.fallback;
    this.message = message;
    if (this.cause) {
      this.message += ` (cause: ${this.cause.message})`;
    }
  }
}

module.exports = (geoAdresseApi) => {
  let cache = caches.geoAdresseApiCache();

  function buildAdresse(geojson, props) {
    return {
      ...props,
      departement: pick(findDepartementByInsee(props.code_insee), ["code", "nom"]),
      region: pick(findRegionByCodeInsee(props.code_insee), ["code", "nom"]),
      academie: pick(findAcademieByCodeInsee(props.code_insee), ["code", "nom"]),
      geojson: {
        type: geojson.type,
        geometry: geojson.geometry,
        ...(geojson.properties?.score
          ? {
              properties: {
                score: geojson.properties.score,
              },
            }
          : {}),
      },
    };
  }

  async function findCommune(source, fallback) {
    let found = await dbCollection("communes").findOne(
      { "properties.codgeo": fallback.codeInsee },
      { projection: { _id: 0 } }
    );

    if (!found) {
      logger.warn(`Commune ${fallback.codeInsee} inconnue`);
      return null;
    }

    return buildAdresse(found, {
      label: source,
      code_postal: fallback.codePostal,
      code_insee: fallback.codeInsee,
      localite: found.properties.libgeo,
    });
  }

  async function newError(message, source, fallback) {
    return new GeocodingError(message, {
      fallback: fallback ? await findCommune(source, fallback) : null,
    });
  }

  async function selectBestResult(source, results, fallback) {
    let best = results.features[0];

    if (!best) {
      throw await newError(`Pas de résultats pour l'adresse ${source}`, source, fallback);
    } else if (best.properties.score < MIN_GEOCODE_SCORE) {
      throw await newError(
        `Score ${best.properties.score} trop faible pour l'adresse ${source} / ${best.geometry.coordinates}`,
        source,
        fallback
      );
    }

    return buildAdresse(best, {
      label: best.properties.label,
      code_postal: best.properties.postcode,
      code_insee: best.properties.citycode,
      localite: best.properties.city,
    });
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
    async geocode(adresse, options = {}) {
      let results = await search(adresse);
      return selectBestResult(adresse, results, options.fallback);
    },
    async reverseGeocode(longitude, latitude) {
      let results = await reverse(longitude, latitude);
      return selectBestResult(`${longitude}_${latitude}`, results);
    },
  };
};
