const GeoAdresseApi = require("../common/apis/GeoAdresseApi");
const { createSource } = require("./sources/sources");
const collectSources = require("./collectSources");
const importOrganismes = require("./importOrganismes");
const importCFD = require("./importCFD");
const consolidate = require("./consolidate");
const { clearCollection } = require("../common/db/mongodb");
const importDatagouv = require("./importDatagouv");
const importCommunes = require("./importCommunes");

async function build(options = {}) {
  const stats = [];

  function collectAll(sourceNames, globalOptions = {}) {
    const sources = sourceNames.map((sourceName) => createSource(sourceName, globalOptions));
    return collectSources(sources).then((res) => stats.push({ collect: res }));
  }

  if (options.clearCache) {
    await clearCollection("cache");
  }

  if (!options.skipImport) {
    await Promise.all([importCFD(), importDatagouv(), importCommunes()]).then(([cfd, datagouv, communes]) => {
      return stats.push({ imports: { cfd, datagouv, communes } });
    });
  }

  const referentiels = options.referentiels || ["catalogue-etablissements", "sifa-ramsese", "datagouv"];
  const sources = referentiels.map((name) => createSource(name));
  await importOrganismes(sources).then((res) => stats.push({ importOrganismes: res }));

  const geoAdresseApi = new GeoAdresseApi(); //Permet de partager le rate limiting pour toutes les sources
  await collectAll(["deca", "catalogue-etablissements", "sifa-ramsese", "refea"]);
  await collectAll(["onisep", "onisep-structure", "ideo2", "datagouv"]);
  await collectAll(["sirene"], { geoAdresseApi });
  await collectAll(["catalogue"], { geoAdresseApi });

  await consolidate().then((res) => stats.push({ consolidate: res }));

  //Ces sources utilisent l'UAI comme selecteur donc il faut les collecter après la consolidation
  await collectAll(["acce", "voeux-affelnet"]);

  return stats;
}

module.exports = build;
