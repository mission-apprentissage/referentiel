const { transformIntoCSV, transformData, compose, mergeStreams, writeData, oleoduc } = require("oleoduc");
const { dbCollection } = require("../../common/db/mongodb");
const { parseCsv } = require("../../common/utils/csvUtils");
const { pick } = require("lodash");

function findMostPopularUAI(etablissements) {
  let uais = etablissements.uais.filter(({ sources }) => {
    return sources.includes("deca") || sources.includes("sifa-ramsese") || sources.includes("catalogue-etablissements");
  });

  if (uais.length === 0) {
    return null;
  }

  let found = uais.reduce((acc, u) => (acc.sources.length < u.sources.length ? u : acc));

  return found.uai;
}

function getUAI(source, etablissement) {
  let uais = etablissement.uais.filter((u) => u.sources.includes(source));

  let found = uais.find((u) => u.uai === etablissement.uai);
  if (etablissement.uai && found) {
    return found.uai;
  } else {
    return uais.reduce((acc, u) => {
      if (!acc) {
        return u;
      }
      return acc.sources.length < u.sources.length ? u : acc;
    }, null)?.uai;
  }
}

function getTask(etablissement) {
  if (!etablissement.etat_administratif || etablissement.etat_administratif === "fermé") {
    return "inconnu";
  }

  let uai = findMostPopularUAI(etablissement);
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
    dbCollection("etablissements").find(filter).limit(limit).sort({ siret: 1 }).stream(),
    transformData((etablissement) => {
      let task = getTask(etablissement);
      if (task !== "à valider") {
        return null;
      }
      return {
        etablissement,
        task,
      };
    }),
    transformIntoCSV({
      separator: ",",
      columns: {
        Académie: ({ etablissement }) => etablissement.adresse?.nom,
        Siret: ({ etablissement }) => etablissement.siret,
        "Raison sociale": (a) => sanitize(a.raison_sociale),
        Statuts: ({ etablissement }) => etablissement.statuts.sort().reverse().join(" et "),
        DECA: ({ etablissement }) => getUAI("deca", etablissement),
        "SIFA RAMSESE": ({ etablissement }) => getUAI("sifa-ramsese", etablissement),
        Catalogue: ({ etablissement }) => getUAI("catalogue-etablissements", etablissement),
        UAI: ({ etablissement }) => findMostPopularUAI(etablissement),
        Tache: ({ task }) => task,
        Précédent: ({ etablissement }) => {
          let found = previous.find((p) => p.SIRET === etablissement.siret);
          return found ? found.UAI : "";
        },
      },
    })
  );
}

module.exports = experimentationCsvStream;
