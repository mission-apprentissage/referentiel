const { program: cli } = require("commander");
const { createWriteStream, createReadStream } = require("fs");
const { oleoduc, writeToStdout } = require("oleoduc");
const experimentationCsvStream = require("./experimentationCsvStream");
const addModifications = require("./addModifications");
const runScript = require("../runScript");

cli
  .command("addModifications")
  .argument("<file>", "Le fichier avec les couples siret-uai validés", createReadStream)
  .action((file) => {
    runScript(() => {
      return addModifications(file);
    });
  });

cli
  .command("export")
  .description("Exporte la liste des organismes à valider")
  .option("--filter <filter>", "Filtre au format json", JSON.parse)
  .option("--limit <limit>", "Nombre maximum d'éléments à exporter", parseInt)
  .option("--out <out>", "Fichier cible dans lequel sera stocké l'export (defaut: stdout)", createWriteStream)
  .option("--previous <previous>", "Des fichiers contenant des analyses précédentes", (v) => {
    return v.split(",").map((f) => createReadStream(f));
  })
  .action(({ filter, limit, previous, out }) => {
    runScript(async () => {
      const options = { filter, limit, previous };
      const stream = await experimentationCsvStream(options);
      return oleoduc(stream, out || writeToStdout());
    });
  });

cli.parse(process.argv);
