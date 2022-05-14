const { transformIntoCSV, transformData, compose, mergeStreams, writeData, oleoduc } = require("oleoduc");
const { dbCollection } = require("../../common/db/mongodb");
const { parseCsv } = require("../../common/utils/csvUtils");
const { pick } = require("lodash");
const findUAIProbable = require("../../common/actions/findUAIProbable");

function getUAI(source, organisme) {
  const potentiels = organisme.uai_potentiels.filter((u) => u.sources.includes(source));

  const found = potentiels.find((u) => u.uai === organisme.uai);
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

  const probable = findUAIProbable(organisme);
  return probable ? "à valider" : "à expertiser";
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

  const confirmed = [];
  await oleoduc(
    mergeStreams(streams.map((s) => readCSV(s))),
    writeData((data) => confirmed.push(pick(data, ["SIRET", "UAI"])))
  );

  return confirmed;
}

async function experimentationCsvStream(options = {}) {
  const filter = options.filter || {};
  const limit = options.limit || Number.MAX_SAFE_INTEGER;
  const previous = options.previous ? await loadPrevious(options.previous) : [];

  return compose(
    dbCollection("organismes")
      .find({ uai: { $exists: false }, ...filter })
      .limit(limit)
      .sort({ siret: 1 })
      .stream(),
    transformData((organisme) => {
      const task = getTask(organisme);
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
        Nature: ({ organisme }) => organisme.nature.replace(/_/g, " et "),
        DECA: ({ organisme }) => getUAI("deca", organisme),
        "SIFA RAMSESE": ({ organisme }) => getUAI("sifa-ramsese", organisme),
        Catalogue: ({ organisme }) => getUAI("catalogue-organismes", organisme),
        UAI: ({ organisme }) => findUAIProbable(organisme)?.uai,
        Tache: ({ task }) => task,
        Précédent: ({ organisme }) => {
          const found = previous.find((p) => p.SIRET === organisme.siret);
          return found ? found.UAI : "";
        },
      },
    })
  );
}

module.exports = experimentationCsvStream;
