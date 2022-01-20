const { compose, transformData, flattenArray } = require("oleoduc");
const CatalogueApi = require("../../common/apis/CatalogueApi");
const GeoAdresseApi = require("../../common/apis/GeoAdresseApi");
const adresses = require("../../common/adresses");
const { dbCollection } = require("../../common/db/mongodb");
const { omitNil } = require("../../common/utils/objectUtils");

function fetchFormations(api, options = {}) {
  let siret = options.siret;
  let query = {
    published: true,
    ...(siret ? { $or: [{ etablissement_formateur_siret: siret }, { etablissement_gestionnaire_siret: siret }] } : {}),
  };

  return api.streamFormations(query, {
    limit: 1000000,
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
  });
}

function buildRelation(formation, natures) {
  if (formation.etablissement_gestionnaire_siret === formation.etablissement_formateur_siret) {
    return null;
  }

  if (natures.includes("responsable")) {
    return omitNil({
      type: "responsable->formateur",
      siret: formation.etablissement_formateur_siret,
      label: formation.etablissement_formateur_entreprise_raison_sociale,
    });
  } else {
    return omitNil({
      type: "formateur->responsable",
      siret: formation.etablissement_gestionnaire_siret,
      label: formation.etablissement_gestionnaire_entreprise_raison_sociale,
    });
  }
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
    let adresse = await getAdresseFromCoordinates(longitude, latitude, {
      adresse: formation.lieu_formation_adresse,
    });

    return {
      lieu: {
        code: `${longitude}_${latitude}`,
        adresse,
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

function buildContacts(formation) {
  if (!formation.email) {
    return null;
  }

  return formation.email.split("##").map((email) => {
    return {
      email,
      confirmé: false,
    };
  });
}

module.exports = (custom = {}) => {
  let api = custom.catalogueAPI || new CatalogueApi();
  let { getAdresseFromCoordinates } = adresses(custom.geoAdresseApi || new GeoAdresseApi());

  async function extractData(formation, natures) {
    try {
      let res = {
        relations: [],
        contacts: [],
        diplomes: [],
        certifications: [],
        lieux_de_formation: [],
        anomalies: [],
        natures,
      };

      let contacts = buildContacts(formation);
      if (contacts) {
        res.contacts = contacts;
      }

      let relation = buildRelation(formation, natures);
      if (relation) {
        res.relations.push(relation);
      }

      if (natures.includes("formateur")) {
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
      return compose(
        fetchFormations(api, options.filters),
        transformData(async (formation) => {
          if (formation.etablissement_formateur_siret === formation.etablissement_gestionnaire_siret) {
            return [
              {
                from: "catalogue",
                selector: formation.etablissement_formateur_siret,
                ...(await extractData(formation, ["responsable", "formateur"])),
              },
            ];
          }

          let [responsable, formateur] = await Promise.all([
            extractData(formation, ["responsable"]),
            extractData(formation, ["formateur"]),
          ]);

          return [
            {
              from: "catalogue",
              selector: formation.etablissement_gestionnaire_siret,
              ...responsable,
            },
            {
              from: "catalogue",
              selector: formation.etablissement_formateur_siret,
              ...formateur,
            },
          ];
        }),
        flattenArray()
      );
    },
  };
};
