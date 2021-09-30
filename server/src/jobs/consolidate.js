const logger = require("../common/logger");
const { dbCollection } = require("../common/db/mongodb");
const { some } = require("lodash");
const { oleoduc, filterData, writeData } = require("oleoduc");

async function selectUAI() {
  let collection = dbCollection("etablissements");
  let stats = {
    validated: 0,
    conflicted: 0,
  };

  function withPopularUAIAndSources(uai) {
    let uaiFilter = uai ? { uai } : {};
    return {
      $or: [
        {
          uais: {
            $elemMatch: { sources: { $all: ["deca", "sifa-ramsese", "catalogue-etablissements"] }, ...uaiFilter },
          },
        },
        {
          uais: { $elemMatch: { sources: { $all: ["deca", "sifa-ramsese"] }, ...uaiFilter } },
          "uais.sources": { $ne: "catalogue-etablissements" },
        },
      ],
    };
  }

  function handleAnomalies(etablissement, mostPopularUAI, nbConflicts) {
    logger.warn(
      `Impossible de valider l'UAI ${mostPopularUAI} pour l'établissement ${etablissement.siret}` +
        ` car il est en conflict avec ${nbConflicts} autres établissements`
    );

    return collection.updateOne(
      { siret: etablissement.siret },
      {
        $push: {
          "_meta.anomalies": {
            $each: [
              {
                job: "consolidate",
                source: "referentiel",
                date: new Date(),
                code: "conflit_uai",
                details: `UAI ${mostPopularUAI} en conflict avec ${nbConflicts} autres établissements`,
              },
            ],
            $slice: 10,
            $sort: { date: -1 },
          },
        },
      },
      { runValidators: true }
    );
  }

  let cursor = collection.find({ uai: { $exists: false }, ...withPopularUAIAndSources() }).stream();
  for await (const etablissement of cursor) {
    let mostPopularUAI = etablissement.uais.reduce((acc, u) => {
      let filterSources = (array) => {
        return array.filter((s) => ["deca", "sifa-ramsese", "catalogue-etablissements"].includes(s));
      };
      return filterSources(acc.sources).length < filterSources(u.sources).length ? u : acc;
    }).uai;

    let nbConflicts = await collection.count({
      siret: { $ne: etablissement.siret },
      ...withPopularUAIAndSources(mostPopularUAI),
    });

    if (nbConflicts === 0) {
      logger.info(`UAI ${mostPopularUAI} validé pour l'établissement ${etablissement.siret}`);
      await collection.updateMany({ siret: etablissement.siret }, { $set: { uai: mostPopularUAI } });
      stats.validated++;
    } else {
      stats.conflicted++;
      await handleAnomalies(etablissement, mostPopularUAI, nbConflicts);
    }
  }

  return stats;
}

async function markAsGestionnaireOrFormateur() {
  let updated = 0;
  let cursor = dbCollection("etablissements").find().stream();
  await oleoduc(
    cursor,
    filterData((etablissement) => etablissement.diplomes.length > 0 || etablissement.relations.length > 0),
    writeData(async (etablissement) => {
      let hasDiplomes = etablissement.diplomes.length > 0;
      let { modifiedCount } = await dbCollection("etablissements").updateOne(
        { siret: etablissement.siret },
        {
          $set: {
            formateur: hasDiplomes || some(etablissement.relations, (r) => r.type === "gestionnaire"),
            gestionnaire: hasDiplomes || some(etablissement.relations, (r) => r.type === "formateur"),
          },
        }
      );
      updated += modifiedCount;
    })
  );

  return { updated };
}

async function consolidate() {
  return {
    selectUAI: await selectUAI(),
    markAsGestionnaireOrFormateur: await markAsGestionnaireOrFormateur(),
  };
}

module.exports = consolidate;
