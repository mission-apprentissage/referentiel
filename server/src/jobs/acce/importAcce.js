const AcceApi = require("../../common/apis/AcceApi");
const logger = require("../../common/logger");
const { dbCollection } = require("../../common/db/mongodb");
const { merge } = require("lodash");

const natures = [
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
];

async function importAcce(options = {}) {
  let api = options.acceApi || new AcceApi();
  let stats = {
    total: 0,
    created: 0,
    updated: 0,
    failed: 0,
  };
  let { nbResults, session, searchParams } = await api.search({
    ...(options.uai ? { uai: options.uai } : { natures }),
  });
  let end = options.end || nbResults;

  logger.info(`Import de ${end} établissements pour la session de recherche ${session.Cookie}...`);
  for (let index = options.start || 1; index <= end && index <= nbResults; index++) {
    stats.total++;
    try {
      let data = await api.getEtablissement(session, index);

      let res = await dbCollection("acce").updateOne(
        { uai: data.uai },
        {
          $set: {
            ...merge({ rattachements: { fille: [], mere: [] }, specificites: [] }, data),
            _search: {
              searchIndex: index,
              searchParams: searchParams.toString(),
            },
          },
        },
        { upsert: true }
      );

      stats.updated += res.modifiedCount;
      stats.created += res.upsertedCount;
      logger.info(`Etablissement ${index} importé`);
    } catch (e) {
      logger.error(e, `Impossible d'importer l'établissement ${index}`);
      stats.failed++;
    }
  }

  return stats;
}

module.exports = importAcce;
