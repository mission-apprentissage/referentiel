const { uniqBy, chain, uniq } = require("lodash");
const { oleoduc, transformData } = require("oleoduc");
const CatalogueApi = require("../../common/apis/CatalogueApi");
const GeoAdresseApi = require("../../common/apis/GeoAdresseApi");
const adresses = require("../../common/adresses");
const { dbCollection } = require("../../common/db/mongodb");

async function getFormations(api, siret, options = {}) {
  let res = await api.getFormations(
    {
      $or: [{ etablissement_formateur_siret: siret }, { etablissement_gestionnaire_siret: siret }],
    },
    {
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
      },
      limit: 600, // no pagination needed for the moment
      ...options,
    }
  );

  return res.formations;
}

async function buildRelations(siret, formations) {
  let relations = formations
    .filter((f) => f.etablissement_gestionnaire_siret !== f.etablissement_formateur_siret)
    .map((f) => {
      let isFormateurType = siret === f.etablissement_gestionnaire_siret;
      let relationSiret = isFormateurType ? f.etablissement_formateur_siret : f.etablissement_gestionnaire_siret;
      let label = isFormateurType
        ? f.etablissement_formateur_entreprise_raison_sociale
        : f.etablissement_gestionnaire_entreprise_raison_sociale;

      return {
        siret: relationSiret,
        label,
        type: isFormateurType ? "formateur" : "gestionnaire",
      };
    });

  return {
    relations: uniqBy(relations, "siret"),
    gestionnaire:
      formations.some((f) => f.etablissement_gestionnaire_siret === f.etablissement_formateur_siret) ||
      relations.some((r) => r.type === "formateur"),
    formateur:
      formations.some((f) => f.etablissement_gestionnaire_siret === f.etablissement_formateur_siret) ||
      relations.some((r) => r.type === "gestionnaire"),
  };
}

async function buildDiplomes(siret, formations) {
  let diplomes = await Promise.all(
    formations
      .filter((f) => f.cfd && siret === f.etablissement_formateur_siret)
      .map(async (f) => {
        let bcn = await dbCollection("cfd").findOne({ FORMATION_DIPLOME: f.cfd });
        return {
          code: f.cfd,
          type: "cfd",
          ...(bcn ? { niveau: bcn.NIVEAU_FORMATION_DIPLOME, label: bcn.LIBELLE_COURT } : {}),
        };
      })
  );
  return { diplomes: uniqBy(diplomes, "code") };
}

async function buildCertifications(siret, formations) {
  let certifications = await Promise.all(
    formations
      .filter((f) => f.rncp_code && siret === f.etablissement_formateur_siret)
      .map(async (f) => {
        return {
          code: f.rncp_code,
          label: f.rncp_intitule,
          type: "rncp",
        };
      })
  );
  return { certifications: uniqBy(certifications, "code") };
}

async function buildLieuxDeFormation(siret, formations, getAdresseFromCoordinates) {
  let anomalies = [];
  let lieux = await Promise.all(
    chain(formations.filter((f) => f.lieu_formation_geo_coordonnees && siret === f.etablissement_formateur_siret))
      .uniqBy("lieu_formation_geo_coordonnees")
      .map(async (f) => {
        let [latitude, longitude] = f.lieu_formation_geo_coordonnees.split(",");

        let adresse = await getAdresseFromCoordinates(longitude, latitude, {
          label: f.lieu_formation_adresse,
        }).catch((e) => {
          anomalies.push({
            code: "lieudeformation_geoloc_impossible",
            message: `Lieu de formation inconnu : ${f.lieu_formation_adresse}. ${e.message}`,
          });
        });

        return adresse
          ? {
              adresse,
              ...(f.lieu_formation_siret ? { siret: f.lieu_formation_siret } : {}),
            }
          : null;
      })
      .value()
  );

  return { lieux: lieux.filter((a) => a), anomalies };
}

function buildContacts(formations) {
  let contacts = formations
    .filter((f) => f.email && f.id_rco_formation)
    .reduce((acc, f) => {
      let found = acc.find((a) => a.email === f.email);
      if (!found) {
        acc.push({
          email: f.email,
          confirmé: false,
          _extra: [f.id_rco_formation],
        });
      } else {
        found._extra = uniq([...found._extra, f.id_rco_formation]);
      }

      return acc;
    }, []);

  return { contacts };
}

module.exports = (custom = {}) => {
  let name = "catalogue";
  let api = custom.catalogueAPI || new CatalogueApi();
  let { getAdresseFromCoordinates } = adresses(custom.geoAdresseApi || new GeoAdresseApi());

  return {
    name,
    stream(options = {}) {
      let filters = options.filters || {};

      return oleoduc(
        dbCollection("annuaire").find(filters, { siret: 1 }).stream(),
        transformData(
          async ({ siret }) => {
            try {
              let [_2020, _2021] = await Promise.all([
                getFormations(api, siret),
                getFormations(api, siret, { annee: "2021" }),
              ]);

              let formations = [..._2020, ..._2021];
              let { relations, gestionnaire, formateur } = await buildRelations(siret, formations);
              let { contacts } = buildContacts(formations);
              let { diplomes } = await buildDiplomes(siret, formations);
              let { certifications } = await buildCertifications(siret, formations);
              let { lieux, anomalies } = await buildLieuxDeFormation(siret, formations, getAdresseFromCoordinates);

              return {
                selector: siret,
                relations,
                contacts,
                anomalies,
                data: {
                  lieux_de_formation: lieux,
                  diplomes,
                  certifications,
                  gestionnaire,
                  formateur: formateur && _2021.length > 0,
                },
              };
            } catch (e) {
              return {
                selector: siret,
                anomalies: [e],
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
