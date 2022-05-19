const logger = require("../common/logger").child({ context: "acce" });
const { dbCollection } = require("../common/db/mongodb");
const { getFromStorage } = require("../common/utils/ovhUtils");
const { filterData, writeData, oleoduc } = require("oleoduc");
const { parseCsv } = require("../common/utils/csvUtils");

const NATURES = [
  "Annexe d'un organisme de formation - Centre de formation d'apprentis",
  "Antenne d'un établissement d'enseignement supérieur privé",
  "Antenne de centre de formation d'apprentis",
  "Antenne délocalisée d'IUT",
  "Antenne délocalisée d'une composante d'université",
  "Antenne",
  "Centre académique de formation continue",
  "Centre d'enseignement à distance",
  "Centre d'éducation aux technologies appropriées au développement",
  "Centre de formation aux carrières des bibliothèques",
  "Centre de formation d'apprentis, sous convention nationale",
  "Centre de formation d'apprentis, sous convention régionale",
  "Centre de formation professionnelle et de promotion agricole",
  "Centre régional associé au CNAM",
  "Circonscription d'inspection de l'éducation nationale",
  "Direction des services départementaux de l'éducation nationale",
  "Collège",
  "Collège spécialisé",
  "Composante d'un organisme de recherche",
  "Composante d'université avec formation diplômante",
  "Ecole d'administration publique",
  "Ecole d'architecture",
  "Ecole d'ingénieurs",
  "Ecole d'ingénieurs publique (hors tutelle MESR) ou privée",
  "Ecole de commerce, gestion, comptabilité, vente",
  "Ecole de formation agricole ou halieutique",
  "Ecole de formation artistique",
  "Ecole de formation d'enseignants",
  "Ecole de formation sanitaire et sociale",
  "Ecole de plein air",
  "Ecole européenne, des réseaux groupements des GESBF et SEFFECSA",
  "Ecole francaise à l'étranger",
  "Ecole juridique",
  "Ecole normale supérieure",
  "Ecole secondaire spécialisée (second cycle)",
  "Ecole technico-professionnelle de production industrielle",
  "Ecole technico-professionnelle des services",
  "Etablissement composé uniquement de STS et/ou de CPGE",
  "Etablissement d'enseignement général supérieur privé",
  "Etablissement de formation aux métiers du sport",
  "Etablissement de formation continue",
  "Etablissement de lutte contre la tuberculose",
  "Etablissement de réinsertion scolaire",
  "Etablissement expérimental",
  "Etablissement hospitalier",
  "Etablissement médico-expérimental",
  "Etablissement pour déficients auditifs",
  "Etablissement pour déficients visuels",
  "Etablissement pour infirmes moteurs",
  "Etablissement pour poly-handicapés",
  "Etablissement pour sourds-aveugles",
  "Etablissement public d'enseignement supérieur",
  "Etablissement régional d'enseignement adapté",
  "GIP pour la formation continue et l'insertion professionnelle",
  "GRETA",
  "Institut d'admininistration des entreprises",
  "Institut d'études politiques",
  "Institut universitaire de technologie",
  "Institut universitaire professionnalisé",
  "Institut médico-éducatif",
  "Lycée d'enseignement général",
  "Lycée d'enseignement général et technologique",
  "Lycée d'enseignement général, technologique et professionnel agricole",
  "Lycée d'enseignement technologique",
  "Lycée polyvalent",
  "Lycée professionnel",
  "Maison départementale des personnes handicapées",
  "Maison familiale rurale d'éducation et d'orientation",
  "Organisme de formation - Centre de formation d'apprentis",
  "Section d'apprentissage",
  "Section d'enseignement général et professionnel adapté",
  "Section d'enseignement général ou technologique",
  "Section d'enseignement professionnel",
  "Service d'éducation spécialisée et de soins à domicile",
  "Rectorat",
  "Université",
  "Université de technologie",
  "Unité de formation et de recherche (hors santé)",
];

async function importAcce(options = {}) {
  const input = options.input || (await getFromStorage("ACCE_UAI_UTF8.csv"));
  const stats = {
    total: 0,
    created: 0,
    updated: 0,
    failed: 0,
  };

  await oleoduc(
    input,
    parseCsv({
      on_record: (record) => record,
    }),
    filterData((data) => {
      stats.total++;
      return ["Ouvert", "À ouvrir"].includes(data.etat_etablissement_libe) && NATURES.includes(data.nature_uai_libe);
    }),
    writeData(
      async (data) => {
        try {
          const res = await dbCollection("acce").updateOne(
            { numero_uai: data.numero_uai },
            {
              $set: {
                ...data,
              },
            },
            { upsert: true }
          );

          stats.updated += res.modifiedCount;
          stats.created += res.upsertedCount;
          logger.info(`Etablissement ${data.numero_uai} importé`);
        } catch (e) {
          logger.error(e, `Impossible d'importer l'établissement ${data.numero_uai}`);
          stats.failed++;
        }
      },
      { parallel: 10 }
    )
  );

  return stats;
}

module.exports = importAcce;
