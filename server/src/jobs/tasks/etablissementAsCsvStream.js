const { transformIntoCSV, transformData, compose } = require("oleoduc");
const { dbCollection } = require("../../common/db/mongodb");

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

function computeCorrespondance(etablissement) {
  let sources = {
    deca: getUAI("deca", etablissement),
    sifa_ramsese: getUAI("sifa-ramsese", etablissement),
    catalogue: getUAI("catalogue-etablissements", etablissement),
  };

  if (!etablissement.statut || etablissement.statut === "fermé") {
    return {
      task: "inconnu",
      sources,
    };
  }

  if (etablissement.uai) {
    return {
      uai: etablissement.uai,
      task: "à valider",
      sources,
    };
  }

  let uaiAValider = etablissement.uais.find((u) => {
    let sources = u.sources.filter(
      (s) => s.includes("deca") || s.includes("sifa-ramsese") || s.includes("catalogue-etablissements")
    );
    return sources.length > 1;
  })?.uai;

  if (uaiAValider) {
    return {
      uai: uaiAValider,
      task: "à valider",
      sources,
    };
  } else {
    return {
      task: "à expertiser",
      sources,
    };
  }
}

function sanitize(value) {
  return value ? value.replace(/[.,;]/g, "") : "";
}

function etablissementAsCsvStream(options = {}) {
  let filter = options.filter || {};
  let limit = options.limit || Number.MAX_SAFE_INTEGER;

  return compose(
    dbCollection("etablissements").find(filter).limit(limit).sort({ siret: 1 }).stream(),
    transformData((etablissement) => {
      let correspondance = computeCorrespondance(etablissement);
      let gestionnaire = `${etablissement.gestionnaire ? "gestionnaire" : ""}`;
      let formateur = etablissement.formateur ? "formateur" : "";

      return {
        ...etablissement,
        statut: `${gestionnaire} ${gestionnaire && formateur ? "et" : ""} ${formateur}`.trim(),
        correspondance,
      };
    }),
    transformIntoCSV({
      separator: ",",
      columns: {
        Académie: (a) => a.adresse?.academie.nom,
        Siret: (a) => a.siret,
        "Raison sociale": (a) => sanitize(a.raison_sociale),
        Statut: (a) => a.statut,
        DECA: (a) => a.correspondance.sources.deca,
        "SIFA RAMSESE": (a) => a.correspondance.sources.sifa_ramsese,
        Catalogue: (a) => a.correspondance.sources.catalogue,
        UAI: (a) => a.correspondance.uai,
        Tache: (a) => a.correspondance.task,
      },
    })
  );
}

module.exports = etablissementAsCsvStream;
