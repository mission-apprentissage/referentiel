const { compose } = require("oleoduc");
const { parseCsv } = require("../../common/utils/csvUtils");
const logger = require("../../common/logger");
const { dbCollection } = require("../../common/db/mongodb");

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
      let found = await dbCollection("organismes").findOne({ siret });
      if (!found) {
        stats.invalid++;
        continue;
      }

      let res = await dbCollection("modifications").insertOne({
        siret,
        date: new Date(),
        auteur: "experimentation",
        original: {
          ...(found.uai ? { uai: found.uai } : {}),
        },
        changements: {
          uai,
        },
      });
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
