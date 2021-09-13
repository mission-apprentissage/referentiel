const logger = require("../../common/logger");
const { oleoduc, writeData, filterData } = require("oleoduc");
const sifaRamsese = require("./streams/sifaRamsese");
const { getCollection } = require("../../common/db/mongodb");

async function updateRattachements(uai, siret) {
  let { modifiedCount: fille } = await getCollection("acce").updateMany(
    { "rattachements.fille.uai": uai },
    { $set: { "rattachements.fille.$.siret": siret } }
  );

  let { modifiedCount: mere } = await getCollection("acce").updateMany(
    { "rattachements.mere.uai": uai },
    { $set: { "rattachements.mere.$.siret": siret } }
  );

  return fille + mere;
}

async function patchAcce(options = {}) {
  let stats = {
    total: 0,
    updated: 0,
    failed: 0,
    rattachements: {
      updated: 0,
      failed: 0,
    },
  };

  let source = options.sifaRamsese || (await sifaRamsese());

  await oleoduc(
    await source.stream(),
    filterData((data) => data.siret),
    writeData(async ({ uai, siret }) => {
      stats.total++;
      try {
        let { modifiedCount: updated } = await getCollection("acce").updateOne({ uai }, { $set: { siret } });

        if (updated) {
          logger.debug(`Ajout du siret ${siret} pour l'UAI ${uai}...`);
          stats.updated += updated;
        }
      } catch (e) {
        logger.error(`Impossible d'ajouter le siret pour l'UAI ${uai} `, e);
        stats.failed++;
      }

      try {
        stats.rattachements.updated += await updateRattachements(uai, siret);
      } catch (e) {
        logger.error(`Impossible d'ajouter le siret pour le rattachement avec l'UAI ${uai} `, e);
        stats.rattachements.failed++;
      }
    })
  );

  return stats;
}

module.exports = patchAcce;
