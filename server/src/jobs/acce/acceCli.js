const { program: cli } = require("commander");
const { oleoduc, transformData, writeToStdout } = require("oleoduc");
const { getCollection } = require("../../common/db/mongodb.js");
const importAcce = require("./importAcce");
const patchAcce = require("./patchAcce");
const runScript = require("../runScript");

cli
  .command("import")
  .option("--uai <uai>", "Force une recherche pour un UAI donné")
  .option("--start <start>", "Index du premier établissement à importer")
  .option("--end <end>", "Index du dernier établissement à importer")
  .action((options) => {
    runScript(() => {
      return importAcce(options);
    });
  });

cli.command("patch").action(() => {
  runScript(() => {
    return patchAcce();
  });
});

cli
  .command("export")
  .description("Exporte la base ACCE au format ndjson")
  .action(() => {
    runScript(() => {
      return oleoduc(
        getCollection("acce").find({}, { _search: 0 }).stream(),
        transformData((etablissement) => {
          return `${JSON.stringify(etablissement)}\n`;
        }),
        writeToStdout()
      );
    });
  });

cli.parse(process.argv);
