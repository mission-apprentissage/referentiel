const { transformIntoCSV, compose } = require("oleoduc");
const { dbCollection } = require("../common/db/mongodb");

function sanitize(value) {
  return value ? value.replace(/[.,;]/g, "") : "";
}

async function exportOrganismes(options = {}) {
  let filter = options.filter || {};
  let limit = options.limit || Number.MAX_SAFE_INTEGER;

  return compose(
    dbCollection("organismes")
      .find({ ...filter })
      .limit(limit)
      .sort({ siret: 1 })
      .stream(),
    transformIntoCSV({
      separator: ",",
      columns: {
        Siret: (o) => o.siret,
        "Raison sociale": (o) => sanitize(o.raison_sociale),
        Emails: (o) => {
          const email = o.contacts.find((c) => c.confirmé === true)?.email || o.contacts[0]?.email || "";
          return email.split("##")[0];
        },
        Natures: (o) => o.natures.sort().reverse().join(" et "),
        Académie: (o) => o.adresse?.academie.nom,
        Région: (o) => o?.adresse?.region.nom,
      },
    })
  );
}

module.exports = exportOrganismes;
