const logger = require("../common/logger").child({ context: "consolidate" });
const { dbCollection } = require("../common/db/mongodb");
const findUAIProbable = require("../common/actions/findUAIProbable");
const { addModification } = require("../common/actions/addModification.js");
const { oleoduc, writeData } = require("oleoduc");
const { DateTime } = require("luxon");

/**
 * Permet de validation automatiquement les UAI sans passer par la validation manuelle
 */
// eslint-disable-next-line no-unused-vars
async function validateAllUAI() {
  const stats = { total: 0, modifications: 0, unknown: 0, failed: 0 };
  for await (const organisme of dbCollection("organismes").find().stream()) {
    try {
      stats.total++;
      const probable = findUAIProbable(organisme);

      if (probable) {
        await addModification("consolidation", organisme, { uai: probable.uai });
        stats.modifications++;
      } else {
        stats.unknown++;
      }
    } catch (e) {
      logger.error(e, `Impossible de modifier l'uai pour l'organisme ${organisme.siret}`);
      stats.failed++;
    }
  }
  return stats;
}

async function applyModifications(options = {}) {
  const stats = { total: 0, modifications: 0, unknown: 0, failed: 0 };
  const filters = options.filters || {};

  for await (const { siret, changements } of dbCollection("modifications").find(filters).sort({ date: 1 }).stream()) {
    try {
      stats.total++;
      const res = await dbCollection("organismes").updateOne({ siret }, { $set: changements });

      if (res.modifiedCount) {
        stats.modifications++;
      } else if (res.matchedCount === 0) {
        stats.unknown++;
      }
    } catch (e) {
      logger.error(e, `Impossible d'ajouter la modification pour l'organisme ${siret}`);
      stats.failed++;
    }
  }

  return stats;
}

async function removeObsoleteCollectedData() {
  let updated = 0;
  const $prune = { date_maj: { $lt: DateTime.now().minus({ day: 10 }).toJSDate() } };

  await oleoduc(
    dbCollection("organismes").find().stream(),
    writeData(async (organisme) => {
      const { modifiedCount } = await dbCollection("organismes").updateOne(
        { _id: organisme._id },
        {
          $pull: {
            uai_potentiels: $prune,
            relations: $prune,
            contacts: $prune,
            diplomes: $prune,
            certifications: $prune,
            lieux_de_formation: $prune,
            reseaux: $prune,
          },
        }
      );
      updated += modifiedCount;
    })
  );

  return updated;
}

async function consolidate(options) {
  const stats = {};
  stats.obsolete = await removeObsoleteCollectedData();
  stats.modifications = await applyModifications(options);
  return stats;
}

module.exports = consolidate;
