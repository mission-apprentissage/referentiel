const GeoAdresseApi = require("../common/apis/GeoAdresseApi");
const { createSource } = require("./sources/sources");
const collectSources = require("./collectSources");
const importOrganismes = require("./importOrganismes");
const importCFD = require("./importCFD");
const consolidate = require("./consolidate");
const { clearCollection } = require("../common/db/mongodb");

function collectAll(sourceNames, globalOptions = {}) {
  let sources = sourceNames.map((sourceName) => createSource(sourceName, globalOptions));
  return collectSources(sources);
}

async function build(options = {}) {
  let referentiels = options.referentiels || ["catalogue-etablissements", "sifa-ramsese", "mna"];
  let stats = [];

  if (options.clearCache) {
    await clearCollection("cache");
  }

  if (options.removeAll) {
    await clearCollection("organismes");
  }

  await importCFD();

  let sources = referentiels.map((name) => createSource(name));
  await importOrganismes(sources).then((res) => stats.push({ importOrganismes: res }));

  await collectAll(
    [
      "agri",
      "anasup",
      "compagnons-du-devoir",
      "deca",
      "catalogue-etablissements",
      "tableau-de-bord",
      "gesti",
      "opcoep",
      "promotrans",
      "sifa-ramsese",
      "depp",
      "refea",
      "uimm",
      "ymag",
      "mna",
      "onisep",
      "onisep-structure",
      "ideo2",
      "datagouv",
      "sirene",
      "catalogue",
    ],
    {
      //Allow all sources to share the same api instance (ie. rate limit)
      geoAdresseApi: new GeoAdresseApi(),
    }
  ).then((res) => stats.push({ collect: res }));

  await consolidate().then((res) => stats.push({ consolidate: res }));

  //Theses sources use uai as selector, so we need to consolidate UAI before running them
  await collectAll(["ccca-btp", "cci-france", "cma", "mfr", "acce", "voeux-affelnet"]).then((res) =>
    stats.push({ collect_uai: res })
  );

  return stats;
}

module.exports = build;
