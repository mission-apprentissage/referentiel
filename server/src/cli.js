require("dotenv").config();
const { program: cli } = require("commander");
const { computeChecksum } = require("./common/utils/uaiUtils");
const { createReadStream, createWriteStream } = require("fs");
const runScript = require("./jobs/runScript");
const { createSource } = require("./jobs/sources/sources");
const collectSources = require("./jobs/collectSources");
const computeStats = require("./jobs/computeStats");
const importCFD = require("./jobs/importCFD");
const importDatagouv = require("./jobs/importDatagouv");
const importOrganismes = require("./jobs/importOrganismes");
const build = require("./jobs/build");
const migrate = require("./jobs/migrate");
const consolidate = require("./jobs/consolidate");
const { oleoduc } = require("oleoduc");
const generateMagicLinks = require("./jobs/generateMagicLinks");
const writeToStdout = require("oleoduc/lib/writeToStdout");
const exportOrganismes = require("./jobs/exportOrganismes");
const importCommunes = require("./jobs/importCommunes");

cli
  .command("build")
  .argument("[names]", "La liste des sources servant de référence d'organismes")
  .option("--clearCache", "Supprime les données stockées en cache")
  .option("--removeAll", "Supprime tous les établissements")
  .action((names, options) => {
    runScript(() => {
      let referentiels = names ? names.split(",") : null;
      return build({ referentiels, ...options });
    });
  });

cli
  .command("importCommunes")
  .argument(
    "[file]",
    "Le fichier de Datagouv : Contours des communes de France simplifié, avec régions et département d'outre-mer rapprochés",
    createReadStream
  )
  .action((file) => {
    runScript(() => {
      return importCommunes({
        input: file,
      });
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
  .command("importDatagouv")
  .argument("[file]", "Le fichier de la Liste Publique des Organismes de Formation", createReadStream)
  .action((file) => {
    runScript(() => {
      return importDatagouv({
        input: file,
      });
    });
  });

cli
  .command("importOrganismes")
  .argument("<names>", "la liste des sources à importer")
  .argument("[file]", "Le nom du fichier utilisé par la source")
  .option("--removeAll", "Supprimes tous les organismes avant import")
  .description("Importe les organismes contenus dans les sources")
  .action((names, file, options) => {
    runScript(async () => {
      let mainSourceName = names.split(",");
      let input = file ? createReadStream(file) : null;

      let mainSources = mainSourceName.map((name) => createSource(name, { input }));
      return importOrganismes(mainSources, options);
    });
  });

cli
  .command("collectSources")
  .argument("<names>", "la liste des sources à collecter")
  .argument("[file]", "Le nom du fichier utilisé par la source")
  .option("--siret <siret>", "Limite la collecte pour le siret")
  .description("Parcours la ou les sources pour trouver des données complémentaires")
  .action((names, file, { siret }) => {
    runScript(() => {
      let sourceNames = names.split(",");
      let input = file ? createReadStream(file) : null;
      let options = siret ? { filters: { siret } } : {};

      let sources = sourceNames.map((name) => createSource(name, { input }));
      return collectSources(sources, options);
    });
  });

cli.command("consolidate").action(() => {
  runScript(() => {
    return consolidate();
  });
});

cli
  .command("exportOrganismes")
  .description("Exporte la liste des organismes")
  .option("--filter <filter>", "Filtre au format json", JSON.parse)
  .option("--limit <limit>", "Nombre maximum d'éléments à exporter", parseInt)
  .option("--out <out>", "Fichier cible dans lequel sera stocké l'export (defaut: stdout)", createWriteStream)
  .action(({ filter, limit, out }) => {
    runScript(async () => {
      let options = { filter, limit };
      let stream = await exportOrganismes(options);
      return oleoduc(stream, out || writeToStdout());
    });
  });

cli.command("experimentation", "Commandes qui concernent les expérimentations avec les régions tests", {
  executableFile: "jobs/experimentation/experimentationCli.js",
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
  .command("generateMagicLinks")
  .argument("<type>", "region ou academie")
  .description("Génère un fichier csv avec un lien magique pour chaque région")
  .option("--url [url]", "L'url de l'environnement cible")
  .option("--out [out]", "Fichier cible dans lequel sera stocké l'export (defaut: stdout)", createWriteStream)
  .description("Génère un toke permettant de consulter le site pour une region")
  .action((type, { url, out }) => {
    runScript(() => {
      let csvStream = generateMagicLinks(type, { url });
      let output = out || writeToStdout();
      return oleoduc(csvStream, output);
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
