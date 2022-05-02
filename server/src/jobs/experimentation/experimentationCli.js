const { program: cli } = require("commander");
const { createWriteStream, createReadStream } = require("fs");
const { Readable } = require("stream");
const { oleoduc, writeToStdout, transformData, transformIntoCSV } = require("oleoduc");
const experimentationCsvStream = require("./experimentationCsvStream");
const addModifications = require("./addModifications");
const runScript = require("../runScript");
const { createSource } = require("../sources/sources");
const { dbCollection } = require("../../common/db/mongodb");
const { isEmpty } = require("lodash");
const { isUAIValid, isSiretValid } = require("../../common/utils/validationUtils");

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

cli
  .command("analyzeAccePro")
  .option("--out <out>", "Fichier cible dans lequel sera stocké l'export (defaut: stdout)", createWriteStream)
  .action(({ out }) => {
    runScript(async () => {
      let ramsese = createSource("sifa-ramsese-pro");

      return oleoduc(
        await ramsese.raw(),
        transformData(
          async (line) => {
            let siret = line.numero_siren_siret_uai;
            let uai = line.numero_uai;
            let columns = {
              trouvé_dans_le_referentiel: "",
              etat_administratif: "",
              proposition_siret: "",
              organismes_avec_siren_identique: "",
              adresse_connue: "",
            };

            let found;
            if (isEmpty(siret) && (found = await dbCollection("organismes").findOne({ uai }))) {
              columns.trouvé_dans_le_referentiel = "Oui";
              columns.etat_administratif = found.etat_administratif || "";
              columns.proposition_siret = found.siret;
            } else if ((found = await dbCollection("organismes").findOne({ siret }))) {
              columns.trouvé_dans_le_referentiel = "Oui";
              columns.etat_administratif = found.etat_administratif || "";
            } else {
              let sirene = createSource("sirene", { input: Readable.from([{ siret: siret }]) });
              let nbSameSiren = await dbCollection("organismes").countDocuments({
                siret: new RegExp(`^${siret.substring(0, 9)}.*`),
              });

              for await (const { data } of await sirene.stream()) {
                columns.organismes_avec_siren_identique = nbSameSiren > 0 ? "Oui" : "Non";
                columns.etat_administratif = data?.etat_administratif || "";
                if (data?.adresse) {
                  let coordinates = data.adresse.geojson.geometry.coordinates;
                  let nbSimilaires = await dbCollection("organismes").countDocuments({
                    $or: [
                      { "adresse.geojson.geometry.coordinates": coordinates },
                      { "lieux_de_formation.adresse.geojson.geometry.coordinates": coordinates },
                    ],
                  });
                  columns.trouvé_dans_le_referentiel = nbSimilaires > 0 ? "Peut-être" : "Non";
                  columns.adresse_connue = nbSimilaires > 0 ? "Oui" : "Non";
                }
              }
            }

            return {
              ...line,
              ...columns,
            };
          },
          { parallel: 10 }
        ),
        transformIntoCSV({}),
        out || writeToStdout()
      );
    });
  });

cli
  .command("analyzeDeca")
  .option("--out <out>", "Fichier cible dans lequel sera stocké l'export (defaut: stdout)", createWriteStream)
  .action(({ out }) => {
    runScript(async () => {
      let deca = createSource("deca");

      return oleoduc(
        await deca.raw(),
        transformData(
          async (line) => {
            let uai = line.FORM_ETABUAI_R;
            let siret = line.FORM_ETABSIRET;
            let canValidate = uai && siret;
            let [validation, parUai, parSiret] = await Promise.all([
              ...(canValidate ? [dbCollection("organismes").findOne({ uai, siret })] : [Promise.resolve(null)]),
              dbCollection("organismes").findOne({ uai }),
              dbCollection("organismes").findOne({ siret }),
            ]);

            return {
              FORM_ETABUAI_R: uai,
              FORM_ETABSIRET: siret,
              validation_uai: isUAIValid(uai) ? "Oui" : "Non",
              validation_siret: siret ? (isSiretValid(siret) ? "Oui" : "Non") : "",
              referentiel_valide: validation ? "Oui" : "Non",
              referentiel_nature: validation?.nature || "",
              referentiel_proposition_siret: !validation ? parUai?.siret : "",
              referentiel_proposition_uai: !validation ? parSiret?.uai : "",
            };
          },
          { parallel: 10 }
        ),
        transformIntoCSV(),
        out || writeToStdout()
      );
    });
  });

cli.parse(process.argv);
