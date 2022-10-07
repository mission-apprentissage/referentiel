const GeoAdresseApi = require("../common/apis/GeoAdresseApi");
const { createSource } = require("./sources/sources");
const collectSources = require("./collectSources");
const importOrganismes = require("./importOrganismes");
const importCFD = require("./importCFD");
const consolidate = require("./consolidate");
const { clearCollection } = require("../common/db/mongodb");
const importDatagouv = require("./importDatagouv");
const importCommunes = require("./importCommunes");
const importAcce = require("./importAcce.js");

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
    await Promise.all([importAcce(), importCFD(), importDatagouv(), importCommunes()]).then(
      ([acce, cfd, datagouv, communes]) => {
        return stats.push({ imports: { acce, cfd, datagouv, communes } });
      }
    );
  }

  const referentiels = options.referentiels || ["catalogue-etablissements", "sifa-ramsese", "datagouv"];
  const sources = referentiels.map((name) => createSource(name));
  await importOrganismes(sources).then((res) => stats.push({ importOrganismes: res }));

  await collectAll(["deca", "catalogue-etablissements", "tableau-de-bord", "sifa-ramsese", "refea"]);
  await collectAll(["onisep", "onisep-structure", "ideo2", "datagouv"]);
  await collectAll(["sirene", "catalogue"], {
    //Permet de partager le rate limiting pour toutes les sources
    geoAdresseApi: new GeoAdresseApi(),
  });

  await consolidate().then((res) => stats.push({ consolidate: res }));

  //Ces sources utilisent l'UAI comme selecteur donc il faut les collecter après la consolidation
  await collectAll(["acce", "voeux-affelnet"]);

  return stats;
}

module.exports = build;
