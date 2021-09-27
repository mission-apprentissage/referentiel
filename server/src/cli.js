require("dotenv").config();
const { program: cli } = require("commander");
const { createWriteStream } = require("fs");
const { oleoduc, writeToStdout } = require("oleoduc");
const { computeChecksum } = require("./common/utils/uaiUtils");
const { createReadStream } = require("fs");
const runScript = require("./jobs/runScript");
const { createSource } = require("./jobs/sources/sources");
const collectSources = require("./jobs/collectSources");
const consolidate = require("./jobs/consolidate");
const etablissementAsCsvStream = require("./jobs/tasks/etablissementAsCsvStream");
const etablissementAsJsonStream = require("./jobs/tasks/etablissementAsJsonStream");
const clear = require("./jobs/clearAll");
const computeStats = require("./jobs/computeStats");
const importCFD = require("./jobs/importCFD");
const importEtablissements = require("./jobs/importEtablissements");
const build = require("./jobs/build");

cli.command("build").action(() => {
  runScript(() => build());
});

cli
  .command("importCFD")
  .option("--nFormationDiplome <nFormationDiplome>", "Un fichier CSV BCN de type N_FORMATION_DIPLOME", createReadStream)
  .option("--vFormationDiplome <vFormationDiplome>", "Un fichier CSV BCN de type V_FORMATION_DIPLOME", createReadStream)
  .action((options) => {
    runScript(() => {
      return importCFD({
        ...(options.nFormationDiplome ? { nFormationDiplome: options.nFormationDiplome } : {}),
        ...(options.vFormationDiplome ? { vFormationDiplome: options.vFormationDiplome } : {}),
      });
    });
  });

cli
  .command("importEtablissements <names> [file]")
  .description("Importe les établissements contenus dans les sources")
  .action((names, file) => {
    runScript(async () => {
      let mainSourceName = names.split(",");
      let input = file ? createReadStream(file) : null;

      let mainSources = mainSourceName.map((name) => createSource(name, { input }));
      return importEtablissements(mainSources);
    });
  });

cli
  .command("collectSources <names> [file]")
  .option("--siret <siret>", "Limite la collecte pour le siret")
  .description("Parcourt la ou les sources pour trouver des données complémentaires")
  .action((names, file, { siret }) => {
    runScript(() => {
      let sourceNames = names.split(",");
      let input = file ? createReadStream(file) : null;
      let options = siret ? { filters: { siret } } : {};

      let sources = sourceNames.map((name) => createSource(name, { input }));
      return collectSources(sources, options);
    });
  });

cli
  .command("consolidate")
  .description("Consolide les données collectées")
  .action(() => {
    runScript(() => {
      return consolidate();
    });
  });

cli
  .command("export")
  .description("Exporte les établissements")
  .option("--filter <filter>", "Filtre au format json", JSON.parse)
  .option("--limit <limit>", "Nombre maximum d'éléments à exporter", parseInt)
  .option("--json", "Exporte les données au format json")
  .option("--out <out>", "Fichier cible dans lequel sera stocké l'export (defaut: stdout)", createWriteStream)
  .action(({ filter, limit, json, out }) => {
    runScript(() => {
      let options = { filter, limit };
      let input = json ? etablissementAsJsonStream(options) : etablissementAsCsvStream(options);

      return oleoduc(input, out || writeToStdout());
    });
  });

cli
  .command("clear")
  .description("Supprime tous les établissements")
  .action(() => {
    runScript(() => {
      return clear();
    });
  });

cli
  .command("computeStats")
  .option("--save", "Sauvegarde les résultats dans les stats")
  .action((options) => {
    runScript(async () => {
      let sourceNames = ["deca", "catalogue-etablissements", "sifa-ramsese"];
      let sources = sourceNames.map((name) => createSource(name));
      return computeStats(sources, options);
    });
  });

cli
  .command("uai <code>")
  .description("Génère un uai valide")
  .action((code) => {
    runScript(() => {
      return {
        uai: `${code}${computeChecksum(code)}`.toUpperCase(),
      };
    });
  });

cli.command("acce", "Gestion de la base de données ACCE", { executableFile: "jobs/acce/acceCli" });
cli.parse(process.argv);
