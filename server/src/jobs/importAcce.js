const logger = require("../common/logger").child({ context: "acce" });
const { dbCollection } = require("../common/db/mongodb");
const { filterData, writeData, oleoduc } = require("oleoduc");
const { parseCsv } = require("../common/utils/csvUtils");
const AcceApi = require("../common/apis/AcceApi.js");

const NATURES = {
  "Annexe d'un organisme de formation - Centre de formation d'apprentis": "625",
  "Antenne de centre de formation d'apprentis": "620",
  "Antenne délocalisée d'IUT": "543",
  "Antenne délocalisée d'une composante d'université": "530",
  "Antenne d'un établissement d'enseignement supérieur privé": "561",
  "Centre académique de formation continue": "847",
  "Centre d'éducation aux technologies appropriées au développement": "344",
  "Centre de formation aux carrières des bibliothèques": "555",
  "Centre de formation d'apprentis, sous convention nationale": "610",
  "Centre de formation d'apprentis, sous convention régionale": "600",
  "Centre de formation professionnelle et de promotion agricole": "740",
  "Centre d'enseignement à distance": "720",
  "Centre régional associé au CNAM": "506",
  "Circonscription d'inspection de l'éducation nationale": "809",
  "Collège": "340",
  "Collège spécialisé": "352",
  "Composante d'université avec formation diplômante": "540",
  "Composante d'un organisme de recherche": "512",
  "Direction des services départementaux de l'éducation nationale": "805",
  "Ecole d'administration publique": "420",
  "Ecole d'architecture": "455",
  "Ecole de commerce, gestion, comptabilité, vente": "445",
  "Ecole de formation agricole ou halieutique": "470",
  "Ecole de formation artistique": "450",
  "Ecole de formation d'enseignants": "410",
  "Ecole de formation sanitaire et sociale": "430",
  "Ecole de plein air": "160",
  "Ecole d'ingénieurs": "553",
  "Ecole d'ingénieurs publique (hors tutelle MESR) ou privée": "580",
  "Ecole européenne, des réseaux groupements des GESBF et SEFFECSA": "305",
  "Ecole francaise à l'étranger": "504",
  "Ecole juridique": "490",
  "Ecole normale supérieure": "503",
  "Ecole secondaire spécialisée (second cycle)": "312",
  "Ecole technico-professionnelle de production industrielle": "480",
  "Ecole technico-professionnelle des services": "440",
  "Etablissement composé uniquement de STS et/ou de CPGE": "400",
  "Etablissement de formation aux métiers du sport": "730",
  "Etablissement de formation continue": "700",
  "Etablissement de lutte contre la tuberculose": "210",
  "Etablissement d'enseignement général supérieur privé": "560",
  "Etablissement de réinsertion scolaire": "349",
  "Etablissement hospitalier": "200",
  "Etablissement médico-expérimental": "249",
  "Etablissement pour déficients auditifs": "247",
  "Etablissement pour déficients visuels": "246",
  "Etablissement pour infirmes moteurs": "242",
  "Etablissement pour poly-handicapés": "245",
  "Etablissement pour sourds-aveugles": "248",
  "Etablissement public d'enseignement supérieur": "505",
  "Etablissement régional d'enseignement adapté / Lycée d’enseignement adapté": "370",
  "GIP pour la formation continue et l'insertion professionnelle": "830",
  "GRETA": "710",
  "Institut d'admininistration des entreprises": "544",
  "Institut d'études politiques": "554",
  "Institut médico-éducatif": "240",
  "Institut universitaire de technologie": "542",
  "Institut universitaire professionnalisé": "541",
  "Lycée d'enseignement général": "302",
  "Lycée d'enseignement général et technologique": "300",
  "Lycée d'enseignement général, technologique et professionnel agricole": "307",
  "Lycée d'enseignement technologique": "301",
  "Lycée expérimental": "315",
  "Lycée polyvalent": "306",
  "Lycée professionnel": "320",
  "Maison départementale des personnes handicapées": "843",
  "Maison familiale rurale d'éducation et d'orientation": "380",
  "Organisme de formation - Centre de formation d'apprentis": "605",
  "Rectorat": "802",
  "Section d'apprentissage": "630",
  "Section d'enseignement général et professionnel adapté": "390",
  "Section d'enseignement général ou technologique": "335",
  "Section d'enseignement professionnel": "334",
  "Service d'éducation spécialisée et de soins à domicile": "290",
  "Unité de formation et de recherche en santé": "537",
  "Unité de formation et de recherche (hors santé)": "539",
  "Université": "523",
  "Université de technologie": "551",
};

const ETATS = {
  "Ouvert": "1",
  "À fermer": "2",
  "À ouvrir": "3",
  "Fermé": "4",
};

async function importAcce(options = {}) {
  const acceApi = options.api || new AcceApi();
  const stream = options.input || (await acceApi.streamCsvExtraction());
  const stats = {
    total: 0,
    created: 0,
    updated: 0,
    failed: 0,
  };

  await oleoduc(
    stream,
    parseCsv(),
    filterData((data) => {
      stats.total++;
      return (
        [ETATS["Ouvert"], ETATS["À ouvrir"]].includes(data.etat_etablissement) &&
        Object.values(NATURES).includes(data.nature_uai)
      );
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
