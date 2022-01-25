const { compose, transformData } = require("oleoduc");
const SireneApi = require("../../common/apis/SireneApi");
const GeoAdresseApi = require("../../common/apis/GeoAdresseApi");
const adresses = require("../../common/adresses");
const categoriesJuridiques = require("../../common/categoriesJuridiques");
const { dbCollection } = require("../../common/db/mongodb");
const createDatagouvSource = require("../sources/datagouv");
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

function getRelations(uniteLegale, siret, sirets) {
  return uniteLegale.etablissements
    .filter((e) => e.siret !== siret && e.etat_administratif === "A" && sirets.includes(e.siret))
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
      let datagouv = createDatagouvSource();
      let sirets = await datagouv.loadSirets();

      return compose(
        dbCollection("organismes").find(filters, { siret: 1, "adresse.code_insee": 1 }).batchSize(20).stream(),
        transformData(
          async ({ siret, adresse: previousAdresse }) => {
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

              let adresse = previousAdresse
                ? null
                : await getAdresse(adresseResolver, etablissement).catch((e) => {
                    anomalies.push({
                      code: "etablissement_geoloc_impossible",
                      message: `Impossible de géolocaliser l'adresse de l'organisme. ${e.message}`,
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
                relations: await getRelations(uniteLegale, siret, sirets),
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
