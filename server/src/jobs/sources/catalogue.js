const { compose, transformData, flattenArray } = require("oleoduc");
const CatalogueApi = require("../../common/apis/CatalogueApi");
const GeoAdresseApi = require("../../common/apis/GeoAdresseApi");
const adresses = require("../../common/adresses");
const { dbCollection } = require("../../common/db/mongodb");
const { omitNil } = require("../../common/utils/objectUtils");
const { compact } = require("lodash");

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

function buildRelation(formation, nature) {
  if (formation.etablissement_gestionnaire_siret === formation.etablissement_formateur_siret) {
    return null;
  }

  if (nature === "responsable->formateur") {
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

async function buildLieuDeFormation(formation, { reverseGeocode }) {
  if (!formation.lieu_formation_geo_coordonnees) {
    return {
      anomalie: {
        key: `lieudeformation_${formation.lieu_formation_adresse}`,
        type: "lieudeformation_geoloc_inconnu",
        details: `Lieu de formation inconnu : ${formation.lieu_formation_adresse}.`,
      },
    };
  }

  try {
    let [latitude, longitude] = formation.lieu_formation_geo_coordonnees.split(",");
    let adresse = await reverseGeocode(longitude, latitude);

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
        key: `lieudeformation_${formation.lieu_formation_adresse}`,
        type: "lieudeformation_geoloc_impossible",
        details: `Lieu de formation non géolocalisable : ${formation.lieu_formation_adresse}. ${e.message}`,
      },
    };
  }
}

function buildContacts(formation) {
  if (!formation.email) {
    return [];
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
  let adresseResolver = adresses(custom.geoAdresseApi || new GeoAdresseApi());

  return {
    name: "catalogue",
    async stream(options = {}) {
      return compose(
        fetchFormations(api, options.filters),
        transformData(async (formation) => {
          let { lieu, anomalie } = await buildLieuDeFormation(formation, adresseResolver);

          return [
            {
              from: "catalogue",
              selector: formation.etablissement_gestionnaire_siret,
              natures: ["responsable"],
              relations: compact([buildRelation(formation, "responsable->formateur")]),
              contacts: buildContacts(formation),
            },
            {
              from: "catalogue",
              selector: formation.etablissement_formateur_siret,
              natures: ["formateur"],
              relations: compact([buildRelation(formation, "formateur->responsable")]),
              contacts: buildContacts(formation),
              diplomes: compact([await buildDiplome(formation)]),
              certifications: compact([buildCertification(formation)]),
              lieux_de_formation: compact([lieu]),
              anomalies: compact([anomalie]),
            },
          ];
        }),
        flattenArray()
      );
    },
  };
};
