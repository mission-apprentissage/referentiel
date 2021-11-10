const GeoAdresseApi = require("../common/apis/GeoAdresseApi");
const { createSource } = require("./sources/sources");
const collectSources = require("./collectSources");
const importEtablissements = require("./importEtablissements");

async function build(options = {}) {
  let referentiels = options.referentiels || ["deca", "catalogue-etablissements", "sifa-ramsese"];
  let stats = [];

  function collectAll(sourceNames, globalOptions = {}) {
    let sources = sourceNames.map((sourceName) => createSource(sourceName, globalOptions));
    return collectSources(sources).then((res) => stats.push({ collect: res }));
  }

  let sources = referentiels.map((name) => createSource(name));
  await importEtablissements(sources, { removeAll: true }).then((res) => stats.push({ importEtablissements: res }));

  await collectAll([
    "agri",
    "anasup",
    "compagnons-du-devoir",
    "datadock",
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
  ]);
  await collectAll(["onisep", "onisep-structure", "ideo2"]);
  await collectAll(["sirene", "catalogue"], {
    //Allow all sources to share the same api instance (ie. rate limit)
    geoAdresseApi: new GeoAdresseApi(),
  });

  //await consolidate().then((res) => stats.push({ consolidation: res }));

  //Theses sources use uai as selector, so we need to consolidate UAI before running them
  await collectAll(["ccca-btp", "cci-france", "cma", "mfr", "acce", "voeux-affelnet"]);

  return stats;
}

module.exports = build;
