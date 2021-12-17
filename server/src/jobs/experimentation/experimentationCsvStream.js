const { transformIntoCSV, transformData, compose, mergeStreams, writeData, oleoduc } = require("oleoduc");
const { dbCollection } = require("../../common/db/mongodb");
const { parseCsv } = require("../../common/utils/csvUtils");
const { pick } = require("lodash");

function findMostPopularUAI(organisme) {
  let potentiels = organisme.uai_potentiels.filter((item) => {
    let sources = item.sources.filter((s) => s.includes("sifa-ramsese") || s.includes("catalogue-etablissements"));
    return sources.length >= 1;
  });

  if (potentiels.length === 0) {
    return null;
  }

  let found = potentiels.reduce((acc, u) => (acc.sources.length < u.sources.length ? u : acc));

  return found.uai;
}

function getUAI(source, organisme) {
  let potentiels = organisme.uai_potentiels.filter((u) => u.sources.includes(source));

  let found = potentiels.find((u) => u.uai === organisme.uai);
  if (organisme.uai && found) {
    return found.uai;
  } else {
    return potentiels.reduce((acc, u) => {
      if (!acc) {
        return u;
      }
      return acc.sources.length < u.sources.length ? u : acc;
    }, null)?.uai;
  }
}

function getTask(organisme) {
  if (!organisme.etat_administratif || organisme.etat_administratif === "fermé") {
    return "inconnu";
  }

  let uai = findMostPopularUAI(organisme);
  return uai ? "à valider" : "à expertiser";
}

function sanitize(value) {
  return value ? value.replace(/[.,;]/g, "") : "";
}

async function loadPrevious(streams) {
  function readCSV(stream) {
    return compose(
      stream,
      parseCsv({
        delimiter: ",",
        trim: true,
        columns: true,
      }),
      transformData((data) => {
        return data.UAI ? pick(data, ["SIRET", "UAI"]) : null;
      })
    );
  }

  let confirmed = [];
  await oleoduc(
    mergeStreams(streams.map((s) => readCSV(s))),
    writeData((data) => confirmed.push(pick(data, ["SIRET", "UAI"])))
  );

  return confirmed;
}

async function experimentationCsvStream(options = {}) {
  let filter = options.filter || {};
  let limit = options.limit || Number.MAX_SAFE_INTEGER;
  let previous = options.previous ? await loadPrevious(options.previous) : [];

  return compose(
    dbCollection("organismes")
      .find({ uai: { $exists: false }, ...filter })
      .limit(limit)
      .sort({ siret: 1 })
      .stream(),
    transformData((organisme) => {
      let task = getTask(organisme);
      if (task !== "à valider") {
        return null;
      }
      return {
        organisme,
        task,
      };
    }),
    transformIntoCSV({
      separator: ",",
      columns: {
        Académie: ({ organisme }) => organisme.adresse?.academie.nom,
        Siret: ({ organisme }) => organisme.siret,
        "Raison sociale": ({ organisme }) => sanitize(organisme.raison_sociale),
        Statuts: ({ organisme }) => organisme.statuts.sort().reverse().join(" et "),
        DECA: ({ organisme }) => getUAI("deca", organisme),
        "SIFA RAMSESE": ({ organisme }) => getUAI("sifa-ramsese", organisme),
        Catalogue: ({ organisme }) => getUAI("catalogue-organismes", organisme),
        UAI: ({ organisme }) => findMostPopularUAI(organisme),
        Tache: ({ task }) => task,
        Précédent: ({ organisme }) => {
          let found = previous.find((p) => p.SIRET === organisme.siret);
          return found ? found.UAI : "";
        },
      },
    })
  );
}

module.exports = experimentationCsvStream;
