const { migrateMongodb, dbCollection } = require("../common/db/mongodb.js");
const { createSource } = require("./sources/sources.js");
const importOrganismes = require("./importOrganismes.js");
const consolidate = require("./consolidate.js");

const VERSION = 16;

async function migrate(options = {}) {
  return migrateMongodb(
    VERSION,
    async () => {
      const dernierImport = await dbCollection("organismes").updateMany({}, [
        { $set: { "_meta.date_dernier_import": "$_meta.date_import" } },
      ]);

      const sources = ["catalogue-etablissements", "sifa-ramsese", "datagouv"].map((name) => createSource(name));
      const stats = {
        imports: await importOrganismes(sources),
        consolidate: await consolidate(),
      };

      return {
        dernier_import: dernierImport,
        ...stats,
      };
    },
    options
  );
}

module.exports = migrate;
