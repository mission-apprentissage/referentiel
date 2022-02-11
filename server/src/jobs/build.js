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
  let referentiels = options.referentiels || ["catalogue-etablissements", "sifa-ramsese", "datagouv", "mna"];
  let stats = [];

  function collectAll(sourceNames, globalOptions = {}) {
    let sources = sourceNames.map((sourceName) => createSource(sourceName, globalOptions));
    return collectSources(sources).then((res) => stats.push({ collect: res }));
  }

  if (options.clearCache) {
    await clearCollection("cache");
  }

  await Promise.all([importCFD(), importDatagouv(), importCommunes()]).then(([cfd, datagouv, communes]) => {
    return stats.push({ imports: { cfd, datagouv, communes } });
  });

  let sources = referentiels.map((name) => createSource(name));
  await importOrganismes(sources).then((res) => stats.push({ importOrganismes: res }));

  await collectAll([
    "deca",
    "catalogue-etablissements",
    "tableau-de-bord",
    "opcoep",
    "sifa-ramsese",
    "depp",
    "refea",
    "ymag",
    "mna",
  ]);

  await collectAll(["onisep", "onisep-structure", "ideo2", "datagouv"]);
  await collectAll(["sirene", "catalogue"], {
    //Allow all sources to share the same api instance (ie. rate limit)
    geoAdresseApi: new GeoAdresseApi(),
  });

  await consolidate().then((res) => stats.push({ consolidate: res }));

  //Theses sources use uai as selector, so we need to consolidate UAI before running them
  await collectAll(["acce", "voeux-affelnet"]);

  return stats;
}

module.exports = build;
