const { compose, transformData, flattenArray, mergeStreams } = require("oleoduc");
const CatalogueApi = require("../../common/apis/CatalogueApi");
const GeoAdresseApi = require("../../common/apis/GeoAdresseApi");
const adresses = require("../../common/adresses");
const { dbCollection } = require("../../common/db/mongodb");
const { omitEmpty } = require("../../common/utils/objectUtils");

function fetchFormations(api, options = {}) {
  let siret = options.siret;
  let query = {
    published: true,
    ...(siret ? { $or: [{ etablissement_formateur_siret: siret }, { etablissement_gestionnaire_siret: siret }] } : {}),
  };

  return api.streamFormations(query, {
    limit: 1000000,
    ...(options.annee
      ? {
          annee: options.annee,
          select: {
            etablissement_gestionnaire_siret: 1,
            etablissement_gestionnaire_entreprise_raison_sociale: 1,
            etablissement_formateur_siret: 1,
            etablissement_formateur_entreprise_raison_sociale: 1,
            lieu_formation_adresse: 1,
            lieu_formation_siret: 1,
            lieu_formation_geo_coordonnees: 1,
            rncp_code: 1,
            rncp_intitule: 1,
            cfd: 1,
            cfd_specialite: 1,
            email: 1,
            id_rco_formation: 1,
            tags: 1,
          },
        }
      : {}),
  });
}

function buildRelation(formation, statuts) {
  if (formation.etablissement_gestionnaire_siret === formation.etablissement_formateur_siret) {
    return null;
  }

  let isGestionnaire = statuts.includes("gestionnaire");
  return omitEmpty({
    type: isGestionnaire ? "formateur" : "gestionnaire",
    siret: isGestionnaire ? formation.etablissement_formateur_siret : formation.etablissement_gestionnaire_siret,
    label: isGestionnaire
      ? formation.etablissement_formateur_entreprise_raison_sociale
      : formation.etablissement_gestionnaire_entreprise_raison_sociale,
  });
}

async function buildDiplome(formation) {
  if (!formation.cfd) {
    return null;
  }

  let bcn = await dbCollection("cfd").findOne({ FORMATION_DIPLOME: formation.cfd });
  return {
    type: "cfd",
    code: formation.cfd,
    ...(bcn ? { niveau: bcn.NIVEAU_FORMATION_DIPLOME, label: bcn.LIBELLE_COURT } : {}),
  };
}

function buildCertification(formation) {
  if (!formation.rncp_code) {
    return null;
  }

  return {
    type: "rncp",
    code: formation.rncp_code,
    ...(formation.rncp_intitule ? { label: formation.rncp_intitule } : {}),
  };
}

async function buildLieuDeFormation(formation, getAdresseFromCoordinates) {
  if (!formation.lieu_formation_geo_coordonnees) {
    return {};
  }

  try {
    let [latitude, longitude] = formation.lieu_formation_geo_coordonnees.split(",");
    return {
      lieu: {
        code: `${longitude}_${latitude}`,
        adresse: await getAdresseFromCoordinates(longitude, latitude, {
          label: formation.lieu_formation_adresse,
        }),
        ...(formation.lieu_formation_siret ? { siret: formation.lieu_formation_siret } : {}),
      },
    };
  } catch (e) {
    return {
      anomalie: {
        code: "lieudeformation_geoloc_impossible",
        message: `Lieu de formation inconnu : ${formation.lieu_formation_adresse}. ${e.message}`,
      },
    };
  }
}

function buildContact(formation) {
  if (!formation.email) {
    return null;
  }

  return {
    email: formation.email,
    confirmé: false,
  };
}

module.exports = (custom = {}) => {
  let api = custom.catalogueAPI || new CatalogueApi();
  let { getAdresseFromCoordinates } = adresses(custom.geoAdresseApi || new GeoAdresseApi());

  async function computeData(formation, statuts) {
    try {
      let res = {
        relations: [],
        contacts: [],
        diplomes: [],
        certifications: [],
        lieux_de_formation: [],
        anomalies: [],
        statuts,
      };

      let contact = buildContact(formation);
      if (contact) {
        res.contacts.push(contact);
      }

      let relation = buildRelation(formation, statuts);
      if (relation) {
        res.relations.push(relation);
      }

      if (statuts.includes("formateur")) {
        let diplome = await buildDiplome(formation);
        if (diplome) {
          res.diplomes.push(diplome);
        }

        let certification = buildCertification(formation);
        if (certification) {
          res.certifications.push(certification);
        }

        let { lieu, anomalie } = await buildLieuDeFormation(formation, getAdresseFromCoordinates);
        if (lieu) {
          res.lieux_de_formation.push(lieu);
        }
        if (anomalie) {
          res.anomalies.push(anomalie);
        }
      }

      return res;
    } catch (e) {
      return {
        anomalies: [e],
      };
    }
  }

  return {
    name: "catalogue",
    async stream(options = {}) {
      let filters = options.filters || {};
      let stream = await mergeStreams(
        () => fetchFormations(api, filters),
        () => fetchFormations(api, { ...filters, annee: 2021 }),
        { sequential: true }
      );

      return compose(
        stream,
        transformData(async (formation) => {
          let [formateur, gestionnaire] = await Promise.all([
            dbCollection("etablissements").findOne({ siret: formation.etablissement_formateur_siret }, { siret: 1 }),
            dbCollection("etablissements").findOne({ siret: formation.etablissement_gestionnaire_siret }, { siret: 1 }),
          ]);

          if (!formateur && !gestionnaire) {
            return null;
          }

          if (formation.etablissement_formateur_siret === formation.etablissement_gestionnaire_siret) {
            return [
              {
                from: "catalogue",
                selector: formation.etablissement_formateur_siret,
                ...(await computeData(formation, ["gestionnaire", "formateur"])),
              },
            ];
          } else {
            let array = [];
            if (gestionnaire) {
              array.push({
                from: "catalogue",
                selector: gestionnaire.siret,
                ...(await computeData(formation, ["gestionnaire"])),
              });
            }

            if (formateur) {
              array.push({
                from: "catalogue",
                selector: formateur.siret,
                ...(await computeData(formation, ["formateur"])),
              });
            }
            return array;
          }
        }),
        flattenArray()
      );
    },
  };
};
