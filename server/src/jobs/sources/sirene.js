const { compose, transformData } = require("oleoduc");
const SireneApi = require("../../common/apis/SireneApi");
const GeoAdresseApi = require("../../common/apis/GeoAdresseApi");
const adresses = require("../../common/adresses");
const categoriesJuridiques = require("../../common/categoriesJuridiques");
const { dbCollection } = require("../../common/db/mongodb");
const createDatagouvSource = require("../sources/datagouv");
const caches = require("../../common/caches/caches");

function getEtablissementName(e, uniteLegale) {
  return (
    e.enseigne_1 ||
    e.enseigne_2 ||
    e.enseigne_3 ||
    e.denomination_usuelle ||
    uniteLegale.denomination ||
    uniteLegale.denomination_usuelle_1 ||
    uniteLegale.denomination_usuelle_2 ||
    uniteLegale.denomination_usuelle_3 ||
    uniteLegale.nom
  );
}

function getRelationLabel(e, uniteLegale) {
  let nom = getEtablissementName(e, uniteLegale);

  let localisation;
  if (e.code_postal) {
    localisation = `${e.numero_voie || ""} ${e.code_postal || ""} ${e.libelle_commune || ""}`;
  } else {
    localisation = `${e.libelle_commune_etranger || ""} ${e.code_pays_etranger || ""} ${e.libelle_pays_etranger || ""}`;
  }

  return `${nom} ${localisation}`.replace(/ +/g, " ").trim();
}

async function getAdresse(adresseResolver, data) {
  let { getAdresseFromCoordinates, geocodeAdresse } = adresseResolver;
  const addr = (
    `${data.numero_voie || ""} ${data.indice_repetition || ""} ` +
    `${data.type_voie || ""} ${data.libelle_voie || ""} ` +
    `${data.code_postal || ""} ${data.libelle_commune || ""} `
  )
    .replace(/\s{2,}/g, " ")
    .trim();

  if (data.longitude) {
    return getAdresseFromCoordinates(parseFloat(data.longitude), parseFloat(data.latitude), {
      code_postal: data.code_postal,
      adresse: addr,
    });
  } else {
    return geocodeAdresse(addr);
  }
}

module.exports = (custom = {}) => {
  let name = "sirene";
  let api = custom.sireneApi || new SireneApi();
  let cache = caches.sireneApiCache();
  let adresseResolver = adresses(custom.geoAdresseApi || new GeoAdresseApi());

  return {
    name,
    async stream(options = {}) {
      let filters = options.filters || {};
      let datagouv = createDatagouvSource();
      let organismes = custom.organismes || (await datagouv.loadOrganismeDeFormations());

      return compose(
        dbCollection("organismes").find(filters, { siret: 1 }).stream(),
        transformData(
          async ({ siret }) => {
            try {
              let siren = siret.substring(0, 9);
              let anomalies = [];

              let uniteLegale = await cache.memo(siren, () => api.getUniteLegale(siren));

              let data = uniteLegale.etablissements.find((e) => e.siret === siret);
              if (!data) {
                return {
                  selector: siret,
                  anomalies: [
                    { code: "etablissement_inconnu", message: `Etablissement inconnu pour l'entreprise ${siren}` },
                  ],
                };
              }

              let relations = uniteLegale.etablissements
                .filter((e) => {
                  return e.siret !== siret && e.etat_administratif === "A" && organismes.includes(e.siret);
                })
                .map((e) => {
                  return {
                    siret: e.siret,
                    label: getRelationLabel(e, uniteLegale),
                  };
                });

              let formeJuridique = categoriesJuridiques.find((cj) => cj.code === uniteLegale.categorie_juridique);
              if (!formeJuridique) {
                anomalies.push({
                  code: "categorie_juridique_inconnue",
                  message: `Impossible de trouver la catégorie juridique de l'entreprise : ${uniteLegale.categorie_juridique}`,
                });
              }

              let adresse = await getAdresse(adresseResolver, data).catch((e) => {
                anomalies.push({
                  code: "etablissement_geoloc_impossible",
                  message: `Impossible de géolocaliser l'adresse de l'organisme. ${e.message}`,
                });
              });

              return {
                selector: siret,
                relations,
                anomalies,
                data: {
                  raison_sociale: getEtablissementName(data, uniteLegale),
                  siege_social: data.etablissement_siege === "true",
                  etat_administratif: data.etat_administratif === "A" ? "actif" : "fermé",
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
