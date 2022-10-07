const { transformIntoCSV, compose } = require("oleoduc");
const { DateTime } = require("luxon");
const { range, merge } = require("lodash");
const findUAIProbable = require("./findUAIProbable");
const { encodeStream } = require("iconv-lite");

function sanitize(value) {
  return value ? value.replace(/[.,;]/g, "") : "";
}

function intoCsv(options = {}) {
  return transformIntoCSV(
    merge(
      {
        columns: {
          "Siret": (o) => o.siret,
          "UAI validée": (o) => o.uai,
          "Raison sociale": (o) => sanitize(o.raison_sociale),
          "Enseigne": (o) => sanitize(o.enseigne),
          "numero_declaration_activite": (o) => o.numero_declaration_activite,
          "etat_administratif": (o) => o.etat_administratif,
          "Nature": (o) => o.nature,
          "Adresse": (o) => o.adresse?.label,
          "Académie": (o) => o.adresse?.academie.nom,
          "Région": (o) => o?.adresse?.region.nom,
          "Qualiopi": (o) => (o.qualiopi ? "Oui" : "Non"),
          "Réseaux": (o) => o.reseaux.map((r) => r.code).join("|"),
          "Nombre de relations": (o) => o.relations.length,
          "Nombre de lieux de formation": (o) => o.lieux_de_formation.length,
          "Date d'import": (o) => DateTime.fromJSDate(o._meta.date_import).toISODate(),
          "UAI probable": (o) => findUAIProbable(o)?.uai || "",
          ...range(0, 60).reduce((acc, index) => {
            return {
              ...acc,
              [`UAI potentielle ${index + 1}`]: (o) => o.uai_potentiels[index]?.uai || "",
            };
          }, {}),
        },
      },
      options
    )
  );
}

function intoXls() {
  return compose(
    intoCsv({
      separator: "\t",
      mapper: (v) => `="${v || ""}"`,
    }),
    encodeStream("UTF-16")
  );
}

module.exports = { intoCsv, intoXls };
