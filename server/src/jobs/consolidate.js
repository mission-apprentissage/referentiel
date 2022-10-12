const logger = require("../common/logger").child({ context: "consolidate" });
const { DateTime } = require("luxon");
const { dbCollection } = require("../common/db/mongodb");
const { getLatestCollectDate } = require("../common/actions/getLatestCollectDate.js");
const { getLatestImportDate } = require("../common/actions/getLatestImportDate.js");

function getObsolescenceDate(from) {
  return DateTime.fromJSDate(from).minus({ day: 7 }).toJSDate();
}

async function removeObsoleteCollectedData() {
  const latestCollectDate = await getLatestCollectDate();
  const $obsolete = { $lt: getObsolescenceDate(latestCollectDate) };

  const { modifiedCount } = await dbCollection("organismes").updateMany(
    {
      "_meta.date_collecte": { $gte: latestCollectDate },
    },
    {
      $pull: {
        uai_potentiels: { date_collecte: $obsolete },
        relations: { date_collecte: $obsolete },
        contacts: { date_collecte: $obsolete },
        diplomes: { date_collecte: $obsolete },
        certifications: { date_collecte: $obsolete },
        lieux_de_formation: { date_collecte: $obsolete },
        reseaux: { date_collecte: $obsolete },
      },
    }
  );

  return modifiedCount;
}

async function removeObsoleteOrganismes() {
  const importDate = await getLatestImportDate();
  const { deletedCount } = await dbCollection("organismes").deleteMany({
    "_meta.date_dernier_import": { $lt: getObsolescenceDate(importDate) },
    "$or": [{ etat_administratif: "fermé" }, { etat_administratif: "actif", uai: { $exists: false } }],
  });

  return deletedCount;
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

async function consolidate(options) {
  return {
    obsolete: {
      collecte: await removeObsoleteCollectedData(),
      organismes: await removeObsoleteOrganismes(),
    },
    modifications: await applyModifications(options),
  };
}

module.exports = consolidate;
