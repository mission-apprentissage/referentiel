const { oleoduc, writeData, mergeStreams } = require("oleoduc");
const { intersection, union, range, uniq } = require("lodash");
const logger = require("../common/logger");
const SireneApi = require("../common/apis/SireneApi");
const caches = require("../common/caches/caches");
const { isUAIValid, isSiretValid } = require("../common/utils/validationUtils");
const { dbCollection } = require("../common/db/mongodb");

// eslint-disable-next-line no-unused-vars
async function validateSiretWithApi(siret, cache, sireneApi) {
  if (!isSiretValid(siret)) {
    return { isValid: false, category: "invalides" };
  }

  try {
    const etat_administratif = await cache.memo(siret, async () => {
      const { etat_administratif } = await sireneApi.getEtablissement(siret);
      return etat_administratif;
    });

    return { isValid: true, category: etat_administratif === "A" ? "actifs" : "fermés" };
  } catch (e) {
    if (e.httpStatusCode === 404) {
      return { isValid: false, category: "invalides" };
    }

    logger.error(e);
    return { isValid: false, category: "erreurs" };
  }
}

function buildMatrice(valides, field, mapValues = (values) => values) {
  return Object.keys(valides).reduce((matrice, sourceName) => {
    const values = mapValues(Array.from(valides[sourceName][field]));
    const otherSourceNames = Object.keys(valides).filter((name) => name !== sourceName);

    return {
      ...matrice,
      [sourceName]: otherSourceNames.reduce((acc, otherSourceName) => {
        const otherValues = mapValues(Array.from(valides[otherSourceName][field]));

        return {
          ...acc,
          [sourceName]: {
            intersection: values.length,
            union: values.length,
          },
          [otherSourceName]: {
            intersection: intersection(values, otherValues).length,
            union: union(values).length,
          },
        };
      }, {}),
    };
  }, {});
}

function buildRecoupement(valides, field, mapValues = (values) => values) {
  const data = Object.keys(valides).reduce((acc, sourceName) => {
    const values = mapValues(Array.from(valides[sourceName][field]));
    values.forEach((value) => {
      const found = acc.find((a) => a.value === value);
      if (found) {
        found.sources = uniq([...(found.sources || []), sourceName]);
      } else {
        acc.push({
          value,
          sources: [sourceName],
        });
      }
    });
    return acc;
  }, []);

  return {
    total: data.length,
    ...range(1, Object.keys(valides).length + 1).reduce((acc, index) => {
      return {
        ...acc,
        [index]: data.filter((u) => u.sources.length === index).length,
      };
    }, {}),
  };
}

async function validateSources(sources) {
  const sireneApi = new SireneApi();
  const cache = caches.sireneApiCache();
  const validation = {};
  const valides = {};
  const createSourceUniques = () => ({ uais: new Set(), sirets: new Set(), uais_sirets: new Set() });
  const createSourceStats = () => ({
    total: 0,
    sirets: {
      actifs: 0,
      fermés: 0,
      invalides: 0,
      absents: 0,
      erreurs: 0,
      uniques: 0,
      dupliqués: 0,
    },
    uais: {
      valides: 0,
      absents: 0,
      invalides: 0,
      uniques: 0,
      dupliqués: 0,
    },
  });

  const stream = mergeStreams(
    sources.map((source) => {
      //Create a factory to build streams lazily
      return () => source.stream();
    }),
    { sequential: true }
  );

  await oleoduc(
    stream,
    writeData(
      async ({ from, selector: siret, uai_potentiels = [] }) => {
        const uai = uai_potentiels[0];
        valides[from] = valides[from] || createSourceUniques();
        validation[from] = validation[from] || createSourceStats();
        validation[from].total++;

        logger.debug(`Validation de ${uai} ${siret}...`);

        let isUaiValide = false;
        if (uai) {
          if (isUAIValid(uai)) {
            isUaiValide = true;
            validation[from].uais.valides++;
            if (valides[from].uais.has(uai)) {
              validation[from].uais.dupliqués++;
            } else {
              valides[from].uais.add(uai);
              validation[from].uais.uniques++;
            }
          } else {
            validation[from].uais.invalides++;
          }
        } else {
          validation[from].uais.absents++;
        }

        let isSiretValide = false;
        if (siret) {
          const { isValid, category } = await validateSiretWithApi(siret, cache, sireneApi);
          validation[from].sirets[category]++;
          if (isValid) {
            isSiretValide = true;
            if (valides[from].sirets.has(siret)) {
              validation[from].sirets.dupliqués++;
            } else {
              valides[from].sirets.add(siret);
              validation[from].sirets.uniques++;
            }
          }
        } else {
          validation[from].sirets.absents++;
        }

        if (isUaiValide && isSiretValide) {
          valides[from].uais_sirets.add(`${uai}_${siret}`);
        }
      },
      { parallel: 5 }
    )
  );

  return { validation, valides };
}

async function computeStats(sources, options) {
  const { validation, valides } = await validateSources(sources);
  const stats = {
    validation,
    matrices: {
      uais: buildMatrice(valides, "uais"),
      sirets: buildMatrice(valides, "sirets"),
      sirens: buildMatrice(valides, "sirets", (values) => {
        return uniq(values.map((siret) => siret.substring(0, 9)));
      }),
      uais_sirets: buildMatrice(valides, "uais_sirets"),
      uais_sirens: buildMatrice(valides, "uais_sirets", (values) => {
        return uniq(values.map((siret) => siret.substring(0, 18)));
      }),
    },
    recoupements: {
      uais: buildRecoupement(valides, "uais"),
      sirets: buildRecoupement(valides, "sirets"),
      sirens: buildRecoupement(valides, "sirets", (values) => {
        return uniq(values.map((siret) => siret.substring(0, 9)));
      }),
      uais_sirets: buildRecoupement(valides, "uais_sirets"),
      uais_sirens: buildRecoupement(valides, "uais_sirets", (values) => {
        return uniq(values.map((siret) => siret.substring(0, 18)));
      }),
    },
  };

  if (options.save) {
    await dbCollection("stats").insertOne({
      created_at: new Date(),
      ...stats,
    });
  }

  return stats;
}

module.exports = computeStats;
