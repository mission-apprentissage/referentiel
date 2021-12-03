require("dotenv").config();
const { program: cli } = require("commander");
const { computeChecksum } = require("./common/utils/uaiUtils");
const { createReadStream } = require("fs");
const runScript = require("./jobs/runScript");
const { createSource } = require("./jobs/sources/sources");
const collectSources = require("./jobs/collectSources");
const computeStats = require("./jobs/computeStats");
const importCFD = require("./jobs/importCFD");
const importEtablissements = require("./jobs/importEtablissements");
const build = require("./jobs/build");
const migrate = require("./jobs/migrate");
const addModifications = require("./jobs/addModifications");

cli
  .command("build")
  .argument("[names]", "La liste des sources servant de référence d'établissements")
  .action((names) => {
    runScript(() => {
      let referentiels = names ? names.split(",") : null;
      return build({ referentiels });
    });
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
  .command("importEtablissements")
  .argument("<names>", "la liste des sources à importer")
  .argument("[file]", "Le nom du fichier utilisé par la source")
  .option("--removeAll", "Supprimes tous les établissements avant import")
  .description("Importe les établissements contenus dans les sources")
  .action((names, file, options) => {
    runScript(async () => {
      let mainSourceName = names.split(",");
      let input = file ? createReadStream(file) : null;

      let mainSources = mainSourceName.map((name) => createSource(name, { input }));
      return importEtablissements(mainSources, options);
    });
  });

cli
  .command("collectSources")
  .argument("<names>", "la liste des sources à collecter")
  .argument("[file]", "Le nom du fichier utilisé par la source")
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

cli.command("experimentation", "Commandes qui concernent les expérimentations avec les régions tests", {
  executableFile: "jobs/experimentation/experimentationCli.js",
});

cli
  .command("addModifications")
  .argument("<file>", "Le fichier avec les couples siret-uai validés", createReadStream)
  .action((file) => {
    runScript(() => {
      return addModifications(file);
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
  .command("migrate")
  .option("--dropIndexes", "Supprime les anciens indexes")
  .description("Migre les données de la base")
  .action((options) => {
    runScript(() => {
      return migrate(options);
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
