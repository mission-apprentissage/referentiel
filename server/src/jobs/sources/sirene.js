const { compose, transformData } = require("oleoduc");
const SireneApi = require("../../common/apis/SireneApi");
const GeoAdresseApi = require("../../common/apis/GeoAdresseApi");
const adresses = require("../../common/adresses");
const categoriesJuridiques = require("../../common/categoriesJuridiques");
const { dbCollection } = require("../../common/db/mongodb");
const caches = require("../../common/caches/caches");

function getRaisonSociale(uniteLegale) {
  return (
    uniteLegale.denomination ||
    uniteLegale.denomination_usuelle_1 ||
    uniteLegale.denomination_usuelle_2 ||
    uniteLegale.denomination_usuelle_3 ||
    uniteLegale.nom
  );
}

function getEnseigne(etablissement) {
  return (
    etablissement.enseigne_1 ||
    etablissement.enseigne_2 ||
    etablissement.enseigne_3 ||
    etablissement.denomination_usuelle
  );
}

function getRelationLabel(e, raisonSociale) {
  let localisation;
  if (e.code_postal) {
    localisation = `${e.numero_voie || ""} ${e.code_postal || ""} ${e.libelle_commune || ""}`;
  } else {
    localisation = `${e.libelle_commune_etranger || ""} ${e.code_pays_etranger || ""} ${e.libelle_pays_etranger || ""}`;
  }

  return `${raisonSociale} ${localisation}`.replace(/ +/g, " ").trim();
}

function getAdresse(etablissement, { geocode }) {
  const adresse = (
    `${etablissement.numero_voie || ""} ${etablissement.indice_repetition || ""} ` +
    `${etablissement.type_voie || ""} ${etablissement.libelle_voie || ""} ` +
    `${etablissement.code_postal || ""} ${etablissement.libelle_commune || ""}`
  )
    .replace(/\s{2,}/g, " ")
    .trim();

  return geocode(adresse);
}

function getRelations(uniteLegale, siret) {
  return uniteLegale.etablissements
    .filter((e) => e.siret !== siret && e.etat_administratif === "A")
    .map((e) => {
      return {
        type: "entreprise",
        siret: e.siret,
        label: getRelationLabel(e, getRaisonSociale(uniteLegale)),
      };
    });
}

module.exports = (custom = {}) => {
  let name = "sirene";
  let api = custom.sireneApi || new SireneApi();
  let sireneApiCache = caches.sireneApiCache();
  let adresseResolver = adresses(custom.geoAdresseApi || new GeoAdresseApi());

  return {
    name,
    async stream(options = {}) {
      let filters = options.filters || {};

      return compose(
        dbCollection("organismes").find(filters, { siret: 1, "adresse.code_insee": 1 }).batchSize(20).stream(),
        transformData(
          async ({ siret }) => {
            try {
              let siren = siret.substring(0, 9);
              let anomalies = [];

              let uniteLegale = await sireneApiCache.memo(siren, () => api.getUniteLegale(siren));
              let raisonSociale = getRaisonSociale(uniteLegale);

              let etablissement = uniteLegale.etablissements.find((e) => e.siret === siret);
              if (!etablissement) {
                return {
                  selector: siret,
                  anomalies: [
                    { code: "etablissement_inconnu", message: `Etablissement inconnu pour l'entreprise ${siren}` },
                  ],
                };
              }

              let adresse = await getAdresse(etablissement, adresseResolver).catch((e) => {
                anomalies.push({
                  code: "etablissement_geoloc_impossible",
                  message: e.message,
                });
              });

              let formeJuridique = categoriesJuridiques.find((cj) => cj.code === uniteLegale.categorie_juridique);
              if (!formeJuridique) {
                anomalies.push({
                  code: "categorie_juridique_inconnue",
                  message: `Impossible de trouver la catégorie juridique de l'entreprise : ${uniteLegale.categorie_juridique}`,
                });
              }

              return {
                selector: siret,
                relations: await getRelations(uniteLegale, siret),
                anomalies,
                data: {
                  raison_sociale: raisonSociale,
                  enseigne: getEnseigne(etablissement),
                  siege_social: etablissement.etablissement_siege === "true",
                  etat_administratif: etablissement.etat_administratif === "A" ? "actif" : "fermé",
                  ...(adresse ? { adresse } : {}),
                  ...(formeJuridique ? { forme_juridique: formeJuridique } : {}),
                },
              };
            } catch (e) {
              return {
                selector: siret,
                anomalies: [
                  e.httpStatusCode === 404 ? { code: "entreprise_inconnue", message: `Entreprise inconnue` } : e,
                ],
              };
            }
          },
          { parallel: 5 }
        ),
        transformData((data) => ({ ...data, from: name }))
      );
    },
  };
};
