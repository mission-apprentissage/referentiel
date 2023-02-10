const { dbCollection } = require("../common/db/mongodb.js");
const logger = require("../common/logger.js");

/**
 * Fonction de suppression des réseaux des organismes
 * Initialise les réseaux à un tableau vide
 */
async function clearOrganismesReseaux() {
  logger.info("Suppression de tous les réseaux des organismes ...");
  await dbCollection("organismes").updateMany({}, [{ $set: { reseaux: [] } }]);
  logger.info("Suppression de tous les réseaux des organismes réalisée avec succès !");
}

module.exports = clearOrganismesReseaux;
