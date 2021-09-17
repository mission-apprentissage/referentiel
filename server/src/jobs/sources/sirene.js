const { oleoduc, transformData, accumulateData, writeData } = require("oleoduc");
const SireneApi = require("../../common/apis/SireneApi");
const GeoAdresseApi = require("../../common/apis/GeoAdresseApi");
const datagouv = require("../referentiels/datagouv");
const adresses = require("../../common/adresses");
const categoriesJuridiques = require("../../common/categoriesJuridiques");
const { dbCollection } = require("../../common/db/mongodb");

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

async function loadOrganismeDeFormations() {
  let organismes = [];
  let referentiel = await datagouv();
  let stream = await referentiel.stream();

  await oleoduc(
    stream,
    accumulateData((acc, data) => [...acc, data.siret], { accumulator: [] }),
    writeData((acc) => (organismes = acc))
  );

  return organismes;
}

module.exports = (options = {}) => {
  let name = "sirene";
  let api = options.sireneApi || new SireneApi();
  let { getAdresseFromCoordinates } = adresses(options.geoAdresseApi || new GeoAdresseApi());

  return {
    name,
    async stream(opts = {}) {
      let filters = opts.filters || {};
      let organismes = options.organismes || (await loadOrganismeDeFormations());

      return oleoduc(
        dbCollection("etablissements").find(filters, { siret: 1 }).stream(),
        transformData(
          async ({ siret }) => {
            try {
              let siren = siret.substring(0, 9);
              let anomalies = [];
              let uniteLegale = await api.getUniteLegale(siren);
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

              let adresse;
              if (data.longitude) {
                try {
                  adresse = await getAdresseFromCoordinates(parseFloat(data.longitude), parseFloat(data.latitude), {
                    label: data.geo_adresse,
                  });
                } catch (e) {
                  anomalies.push({
                    code: "etablissement_geoloc_impossible",
                    message: `Impossible de géolocaliser l'adresse de l'établissement: ${data.geo_adresse}. ${e.message}`,
                  });
                }
              } else {
                // TODO getAdresseFromLabel
              }

              let formeJuridique = categoriesJuridiques.find((cj) => cj.code === uniteLegale.categorie_juridique);
              if (!formeJuridique) {
                anomalies.push({
                  code: "categorie_juridique_inconnue",
                  message: `Impossible de trouver la catégorie juridique de l'entreprise : ${uniteLegale.categorie_juridique}`,
                });
              }

              return {
                selector: siret,
                relations,
                anomalies,
                data: {
                  raison_sociale: getEtablissementName(data, uniteLegale),
                  siege_social: data.etablissement_siege === "true",
                  statut: data.etat_administratif === "A" ? "actif" : "fermé",
                  ...(adresse ? { adresse } : {}),
                  ...(formeJuridique ? { forme_juridique: formeJuridique } : {}),
                },
              };
            } catch (e) {
              return {
                selector: siret,
                anomalies: [e.reason === 404 ? { code: "entreprise_inconnue", message: `Entreprise inconnue` } : e],
              };
            }
          },
          { parallel: 5 }
        ),
        transformData((data) => ({ ...data, from: name })),
        { promisify: false }
      );
    },
  };
};
