const { compose } = require("oleoduc");
const { parseCsv } = require("../../common/utils/csvUtils");
const logger = require("../../common/logger").child({ context: "experimentation" });
const { dbCollection } = require("../../common/db/mongodb");
const addModification = require("../../common/actions/addModification");

async function addModifications(stream) {
  let stats = { total: 0, inserted: 0, invalid: 0, failed: 0 };
  let csvStream = compose(stream, parseCsv());

  for await (const data of csvStream) {
    stats.total++;

    let siret = data.siret;
    let uai = data.uai;
    if (!siret || !uai) {
      stats.invalid++;
      continue;
    }

    try {
      let organisme = await dbCollection("organismes").findOne({ siret });
      if (!organisme) {
        stats.invalid++;
        continue;
      }

      let res = await addModification("experimentation", organisme, { uai });
      if (res) {
        stats.inserted++;
      }
    } catch (e) {
      logger.error(e, `Impossible d'ajouter la modification pour l'organisme ${siret}`);
      stats.failed++;
    }
  }

  return stats;
}

module.exports = addModifications;
