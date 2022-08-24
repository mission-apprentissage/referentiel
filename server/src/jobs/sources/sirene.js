const { Readable } = require("stream");
const { compose, transformData, groupData, flattenArray, flattenStream } = require("oleoduc");
const GeoAdresseApi = require("../../common/apis/GeoAdresseApi");
const adresses = require("../../common/adresses");
const { dbCollection } = require("../../common/db/mongodb");
const { fincCategorieJuridiqueByCode } = require("../../common/categoriesJuridiques.js");
const SireneApi = require("../../common/apis/SireneApi.js");
const { asSiren } = require("../../common/utils/stringUtils.js");
const { transformStream } = require("../../common/utils/streamUtils.js");
const getAllSirets = require("../../common/actions/getAllSirets.js");
const createDatagouvSource = require("./datagouv.js");

function str(v) {
  return v || "";
}

function getRaisonSociale(uniteLegale) {
  return (
    uniteLegale.denominationUniteLegale ||
    uniteLegale.denominationUsuelle1UniteLegale ||
    uniteLegale.denominationUsuelle2UniteLegale ||
    uniteLegale.denominationUsuelle3UniteLegale ||
    uniteLegale.nomUniteLegale
  );
}

function getLatestPeriode(etablissement) {
  return etablissement.periodesEtablissement.find((pe) => pe.dateFin === null);
}

function getEnseigne(etablissement) {
  const periode = getLatestPeriode(etablissement);
  return (
    periode.enseigne1Etablissement ||
    periode.enseigne2Etablissement ||
    periode.enseigne3Etablissement ||
    periode.denominationUsuelleEtablissement
  );
}

function isActif(etablissement) {
  const periode = getLatestPeriode(etablissement);
  return periode.etatAdministratifEtablissement === "A";
}

function getAdresseAsString(etablissement) {
  const { adresseEtablissement: adresse } = etablissement;
  return (
    `${str(adresse.numeroVoieEtablissement)} ` +
    `${str(adresse.indiceRepetitionEtablissement)} ` +
    `${str(adresse.typeVoieEtablissement)} ` +
    `${str(adresse.libelleVoieEtablissement)} ` +
    `${str(adresse.codePostalEtablissement)} ` +
    `${str(adresse.libelleCommuneEtablissement)}`
  )
    .replace(/\s{2,}/g, " ")
    .trim();
}

function getRelationLabel(etablissement) {
  const { uniteLegale, adresseEtablissement: adresse } = etablissement;
  const raisonSociale = getRaisonSociale(uniteLegale);

  let localisation;
  if (adresse.codePostalEtablissement) {
    localisation = `${str(adresse.codePostalEtablissement)} ` + `${str(adresse.libelleCommuneEtablissement)}`;
  } else {
    localisation =
      `${str(adresse.libelleCommuneEtrangerEtablissement)} ` +
      `${str(adresse.codePaysEtrangerEtablissement)} ` +
      `${str(adresse.libellePaysEtrangerEtablissement)}`;
  }

  return `${raisonSociale} ${localisation}`.replace(/ +/g, " ").trim();
}

function handleApiError(err, sirets) {
  const errors = sirets.map((siret) => {
    return {
      selector: siret,
      anomalies: [err],
    };
  });
  return Readable.from(errors);
}

module.exports = (custom = {}) => {
  const name = "sirene";
  const api = custom.sireneApi || new SireneApi();
  const { geocode } = adresses(custom.geoAdresseApi || new GeoAdresseApi());

  return {
    name,
    async stream(options = {}) {
      const filters = options.filters || {};
      const datagouv = createDatagouvSource();
      const allSirets = [...(await getAllSirets()), ...(await datagouv.loadSirets())];

      return compose(
        dbCollection("organismes")
          .aggregate([
            { $match: filters },
            { $project: { siren: { $substr: ["$siret", 0, 9] }, siret: 1 } },
            { $group: { _id: "$siren", siren: { $first: "$siren" }, sirets: { $push: "$siret" } } },
          ])
          .stream(),
        groupData({ size: 125 }),
        transformStream(async (group) => {
          const sirens = group.map((item) => item.siren);
          const sirets = group.flatMap((item) => item.sirets);

          try {
            const query = sirens.map((siren) => `siret:${siren}*`).join(" OR ");
            const stream = await api.streamEtablissements(query, { nombre: 1000, tri: "siren" });

            return transformEtablissements(stream, (siret) => allSirets.includes(siret));
          } catch (e) {
            return handleApiError(e, sirets);
          }
        }),
        flattenStream(),
        transformData((data) => ({ ...data, from: name }))
      );

      async function transformEtablissements(stream, filter) {
        return compose(
          stream,
          transformData(
            async (etablissement) => {
              try {
                const anomalies = [];
                const { siret, uniteLegale } = etablissement;
                const addresseAsString = getAdresseAsString(etablissement);
                const actif = isActif(etablissement);

                if (!filter(siret)) {
                  return null;
                }

                const adresse = await geocode(addresseAsString, {
                  fallback: {
                    codeInsee: etablissement.adresseEtablissement.codeCommuneEtablissement,
                    codePostal: etablissement.adresseEtablissement.codePostalEtablissement,
                  },
                }).catch((e) => {
                  anomalies.push({
                    key: `adresse_${addresseAsString}`,
                    type: "etablissement_geoloc_impossible",
                    details: e.message,
                  });
                  return e.commune;
                });

                const formeJuridique = fincCategorieJuridiqueByCode(uniteLegale.categorieJuridiqueUniteLegale);
                if (!formeJuridique) {
                  anomalies.push({
                    key: `categorie_juridique_${uniteLegale.categorieJuridiqueUniteLegale}`,
                    type: "categorie_juridique_inconnue",
                    details: `Impossible de trouver la catégorie juridique de l'entreprise : ${uniteLegale.categorieJuridiqueUniteLegale}`,
                  });
                }

                const results = [
                  {
                    selector: siret,
                    anomalies,
                    data: {
                      raison_sociale: getRaisonSociale(uniteLegale),
                      etat_administratif: actif ? "actif" : "fermé",
                      enseigne: getEnseigne(etablissement),
                      siege_social: etablissement.etablissementSiege === true,
                      ...(adresse ? { adresse } : {}),
                      ...(formeJuridique ? { forme_juridique: formeJuridique } : {}),
                    },
                  },
                ];

                if (actif) {
                  results.push({
                    selector: { $and: [{ siret: new RegExp(`^${asSiren(siret)}.*`) }, { siret: { $ne: siret } }] },
                    relations: [
                      {
                        type: "entreprise",
                        siret,
                        label: getRelationLabel(etablissement),
                      },
                    ],
                  });
                }

                return results;
              } catch (e) {
                return {
                  selector: etablissement.siret,
                  anomalies: [e],
                };
              }
            },
            { parallel: 10 }
          ),
          flattenArray()
        );
      }
    },
  };
};
