const { compose, transformData, flattenArray } = require("oleoduc");
const CatalogueApi = require("../../common/apis/CatalogueApi");
const GeoAdresseApi = require("../../common/apis/GeoAdresseApi");
const adresses = require("../../common/adresses");
const { dbCollection } = require("../../common/db/mongodb");
const { omitNil } = require("../../common/utils/objectUtils");
const { compact } = require("lodash");
const { DateTime } = require("luxon");
const { CATALOG_COMMON_STATUS } = require("../../common/catalogStatuts.js");

function fetchFormations(api, options = {}) {
  const siret = options.siret;
  const lastYear = `${DateTime.now().minus({ year: 1 }).year}`;
  const query = {
    published: true,
    tags: { $ne: [lastYear] }, //Exclusion des formations de l'année précédente
    ...(siret ? { $or: [{ etablissement_formateur_siret: siret }, { etablissement_gestionnaire_siret: siret }] } : {}),
  };

  return api.streamFormations(query, {
    limit: 1000000,
    select: {
      etablissement_gestionnaire_siret: 1,
      etablissement_gestionnaire_entreprise_raison_sociale: 1,
      etablissement_formateur_siret: 1,
      etablissement_formateur_entreprise_raison_sociale: 1,
      uai_formation: 1,
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
      parcoursup_statut: 1,
      affelnet_statut: 1,
      editedFields: 1,
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

  const bcn = await dbCollection("cfd").findOne({ FORMATION_DIPLOME: formation.cfd });
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
    const [latitude, longitude] = formation.lieu_formation_geo_coordonnees.split(",");
    const adresse = await reverseGeocode(longitude, latitude);
    // L'UAI lieu est considéré comme fiable si la formation est en attente ou publié coté PARCOURSUP / AFFELNET ou si l'UAI a été éditée
    const uai_fiable =
      [CATALOG_COMMON_STATUS.PUBLIE, CATALOG_COMMON_STATUS.EN_ATTENTE].includes(formation.parcoursup_statut) ||
      [CATALOG_COMMON_STATUS.PUBLIE, CATALOG_COMMON_STATUS.EN_ATTENTE].includes(formation.affelnet_statut) ||
      !!formation?.editedFields?.uai_formation;

    return {
      lieu: {
        code: `${longitude}_${latitude}`,
        adresse,
        ...(formation.lieu_formation_siret ? { siret: formation.lieu_formation_siret } : {}),
        ...(formation.uai_formation ? { uai: formation.uai_formation } : {}),
        uai_fiable,
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
  const api = custom.catalogueAPI || new CatalogueApi();
  const adresseResolver = adresses(custom.geoAdresseApi || new GeoAdresseApi());

  return {
    name: "catalogue",
    async stream(options = {}) {
      return compose(
        await fetchFormations(api, options.filters),
        transformData(async (formation) => {
          const { lieu, anomalie } = await buildLieuDeFormation(formation, adresseResolver);

          return [
            {
              from: "catalogue",
              selector: formation.etablissement_gestionnaire_siret,
              nature: "responsable",
              relations: compact([buildRelation(formation, "responsable->formateur")]),
              contacts: buildContacts(formation),
            },
            {
              from: "catalogue",
              selector: formation.etablissement_formateur_siret,
              nature: "formateur",
              relations: compact([buildRelation(formation, "formateur->responsable")]),
              contacts: buildContacts(formation),
              diplomes: compact([await buildDiplome(formation)]),
              certifications: compact([buildCertification(formation)]),
              lieux_de_formation: compact([lieu]),
              anomalies: compact([anomalie]),
            },
          ];
        }),
        flattenArray(),
        { parallel: 10 }
      );
    },
  };
};
