const logger = require("../common/logger").child({ context: "import" });
const { fetchStream } = require("../common/utils/httpUtils");
const { oleoduc, writeData } = require("oleoduc");
const { dbCollection } = require("../common/db/mongodb");
const { parseCsv } = require("../common/utils/csvUtils");
const { DateTime } = require("luxon");
const { omitDeepNil } = require("../common/utils/objectUtils");

function getListePubliqueDesOrganismesDeFormationAsStream() {
  return fetchStream("https://data.lheo.org/srcdata/dgefp/lpof/lpof.csv");
}

function parseDate(value) {
  if (!value) {
    return null;
  }
  return DateTime.fromFormat(value, "dd/MM/yyyy", { zone: "utc" }).toJSDate();
}

function parseNumber(value) {
  return value ? parseInt(value) : null;
}

async function importDatagouv(options = {}) {
  const stats = { total: 0, created: 0, updated: 0, failed: 0 };
  const stream = options.input || (await getListePubliqueDesOrganismesDeFormationAsStream());
  logger.info(`Import de la Liste Publique des Organismes de Formation...`);

  await oleoduc(
    stream,
    parseCsv(),
    writeData(
      async (data) => {
        const nda = data.numeroDeclarationActivite;

        try {
          stats.total++;
          const doc = {
            numeroDeclarationActivite: data.numeroDeclarationActivite,
            numerosDeclarationActivitePrecedent: data.numeroDeclarationActivite,
            denomination: data.denomination,
            siren: data.siren,
            siretEtablissementDeclarant: data.siretEtablissementDeclarant,
            adressePhysiqueOrganismeFormation: {
              voie: data["adressePhysiqueOrganismeFormation.voie"],
              codePostal: data["adressePhysiqueOrganismeFormation.codePostal"],
              ville: data["adressePhysiqueOrganismeFormation.ville"],
              codeRegion: data["adressePhysiqueOrganismeFormation.codeRegion"],
            },
            certifications: {
              actionsDeFormation: data["certifications.actionsDeFormation"] === "true",
              bilansDeCompetences: data["certifications.bilansDeCompetences"] === "true",
              VAE: data["certifications.VAE"],
              actionsDeFormationParApprentissage: data["certifications.actionsDeFormationParApprentissage"] === "true",
            },
            organismeEtrangerRepresente: {
              denomination: data["organismeEtrangerRepresente.denomination"],
              voie: data["organismeEtrangerRepresente.voie"],
              codePostal: data["organismeEtrangerRepresente.codePostal"],
              ville: data["organismeEtrangerRepresente.ville"],
              pays: data["organismeEtrangerRepresente.pays"],
            },
            informationsDeclarees: {
              dateDerniereDeclaration: parseDate(data["informationsDeclarees.dateDerniereDeclaration"]),
              debutExercice: parseDate(data["informationsDeclarees.debutExercice"]),
              finExercice: parseDate(data["informationsDeclarees.finExercice"]),
              nbStagiaires: parseNumber(data["informationsDeclarees.nbStagiaires"]),
              nbStagiairesConfiesParUnAutreOF: parseNumber(
                data["informationsDeclarees.nbStagiairesConfiesParUnAutreOF"]
              ),
              effectifFormateurs: parseNumber(data["informationsDeclarees.effectifFormateurs"]),
              specialitesDeFormation: {
                codeSpecialite1: data["informationsDeclarees.specialitesDeFormation.codeSpecialite1"],
                libelleSpecialite1: data["informationsDeclarees.specialitesDeFormation.libelleSpecialite1"],
                codeSpecialite2: data["informationsDeclarees.specialitesDeFormation.codeSpecialite2"],
                libelleSpecialite2: data["informationsDeclarees.specialitesDeFormation.libelleSpecialite2"],
                codeSpecialite3: data["informationsDeclarees.specialitesDeFormation.codeSpecialite3"],
                libelleSpecialite3: data["informationsDeclarees.specialitesDeFormation.libelleSpecialite3"],
              },
            },
          };

          logger.debug(`Import de l'organisme de formation ${nda}...`);
          const res = await dbCollection("datagouv").updateOne(
            {
              numeroDeclarationActivite: nda,
            },
            {
              $set: omitDeepNil(doc),
            },
            { upsert: true }
          );

          stats.updated += res.modifiedCount;
          stats.created += res.upsertedCount;
        } catch (e) {
          logger.error(e, `Impossible d'importer l'organisme de formation  ${nda}`);
          stats.failed++;
        }
      },
      { parallel: 5 }
    )
  );
  return stats;
}

module.exports = importDatagouv;
