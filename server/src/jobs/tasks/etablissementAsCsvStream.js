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

  if (!etablissement.etatAdministratif || etablissement.etatAdministratif === "fermé") {
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
      return {
        ...etablissement,
        correspondance: computeCorrespondance(etablissement),
      };
    }),
    transformIntoCSV({
      separator: ",",
      columns: {
        Académie: (e) => e.adresse?.academie.nom,
        Siret: (e) => e.siret,
        "Raison sociale": (a) => sanitize(a.raison_sociale),
        Statuts: (e) => e.statuts.sort().reverse().join(" et "),
        DECA: (e) => e.correspondance.sources.deca,
        "SIFA RAMSESE": (e) => e.correspondance.sources.sifa_ramsese,
        Catalogue: (e) => e.correspondance.sources.catalogue,
        UAI: (e) => e.correspondance.uai,
        Tache: (e) => e.correspondance.task,
      },
    })
  );
}

module.exports = etablissementAsCsvStream;
