require("dotenv").config();
const { program: cli } = require("commander");
const { computeChecksum } = require("./common/utils/validationUtils");
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
const { oleoduc, writeToStdout } = require("oleoduc");
const generateMagicLinks = require("./jobs/generateMagicLinks");
const exportOrganismes = require("./jobs/exportOrganismes");
const importCommunes = require("./jobs/importCommunes");
const importAcce = require("./jobs/importAcce");

function asArray(v) {
  return v.split(",");
}

cli
  .command("build")
  .description("Construit le référentiel")
  .argument("[names]", "La liste des sources servant de référence d'organismes", asArray)
  .option("--clearCache", "Supprime les données stockées en cache")
  .option("--skipImport", "Permet de ne pas réaliser les imports")
  .action((names, options) => {
    runScript(() => {
      return build({ referentiels: names, ...options });
    });
  });

cli
  .command("importAcce")
  .argument("[file]", "Le fichier extraction CSV", createReadStream)
  .action((file) => {
    runScript(() => {
      return importAcce({ input: file });
    });
  });

cli
  .command("importCommunes")
  .description(
    "Importe les coordonnées de géolocalisation des communes contenus dans le fichier 'Contours des communes de France simplifié, avec régions et département d'outre-mer rapprochés'"
  )
  .argument("[file]", "Le fichier JSON disponible sur Datagouv", createReadStream)
  .action((file) => {
    runScript(() => {
      return importCommunes({ input: file });
    });
  });

cli
  .command("importCFD")
  .description("Importe les codes formation diplomes issus de la BCN")
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
  .description("Importe les organismes contenus dans la Liste Publique des Organismes de Formation")
  .argument("[file]", "Le fichier CSV disponible sur Datagouv", createReadStream)
  .action((file) => {
    runScript(() => {
      return importDatagouv({ input: file });
    });
  });

cli
  .command("importOrganismes")
  .description("Importe les organismes contenus dans les référentiels")
  .argument("<names>", "la liste des sources à importer", asArray)
  .argument("[file]", "Le nom du fichier utilisé par la source")
  .action((names, file, options) => {
    runScript(() => {
      const input = file ? createReadStream(file) : null;

      const mainSources = names.map((name) => createSource(name, { input }));
      return importOrganismes(mainSources, options);
    });
  });

cli
  .command("collectSources")
  .description("Collecte des données dans les sources")
  .argument("<names>", "Noms des sources à collecter", asArray)
  .argument("[files...]", "Noms des fichiers utilisés par les sources")
  .option("--siret <siret>", "Limite la collecte pour le siret")
  .action((names, files, { siret }) => {
    runScript(() => {
      const array = files.length > 0 ? files.map((f) => createReadStream(f)) : null;
      const options = siret ? { filters: { siret } } : {};

      const sources = names.map((name) => createSource(name, { input: array?.length === 1 ? array[0] : array }));
      return collectSources(sources, options);
    });
  });

cli
  .command("consolidate")
  .option("--siret <siret>", "Limite la consolidation pour un siret")
  .description("Consolide les données précédement collectées")
  .action(({ siret }) => {
    runScript(() => {
      const options = siret ? { filters: { siret } } : {};

      return consolidate(options);
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
      const options = { filter, limit };
      const stream = await exportOrganismes(options);
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
      const sourceNames = ["deca", "catalogue-etablissements", "sifa-ramsese"];
      const sources = sourceNames.map((name) => createSource(name));
      return computeStats(sources, options);
    });
  });

cli
  .command("migrate")
  .description("Execute les scripts de migration")
  .option("--dropIndexes", "Supprime les anciens indexes")
  .action((options) => {
    runScript(() => {
      return migrate(options);
    });
  });

cli
  .command("generateMagicLinks")
  .description("Génère un token permettant de consulter le site pour une region")
  .argument("<type>", "region ou academie")
  .description("Génère un fichier csv avec un lien magique pour chaque région")
  .option("--url [url]", "L'url de l'environnement cible")
  .option("--out [out]", "Fichier cible dans lequel sera stocké l'export (defaut: stdout)", createWriteStream)
  .action((type, { url, out }) => {
    runScript(() => {
      const csvStream = generateMagicLinks(type, { url });
      const output = out || writeToStdout();
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

cli.parse(process.argv);
