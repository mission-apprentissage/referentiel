const { compose, transformData, mergeStreams, transformIntoCSV } = require("oleoduc");
const { dbCollection } = require("../common/db/mongodb");

function streamOrganismesSansRelations(query) {
  return compose(
    dbCollection("organismes")
      .find({ ...query, "relations.0": { $exists: false } })
      .stream(),
    transformData(
      async (organisme) => {
        return {
          "Organisme siret": organisme.siret,
          "Organisme UAI": organisme.uai,
          "Organisme raison sociale": organisme.raison_sociale,
          "Organisme état administratif": organisme.etat_administratif,
          "Organisme réseaux": organisme.reseaux.map((r) => r.label).join(", "),
          "Organisme adresse": organisme.adresse?.label,
          "Organisme académie": organisme.adresse?.academie.nom,
          "Organisme région": organisme.adresse?.region.nom,
          "Relation type": "Pas de relations",
          "Relation siret": "ND",
          "Relation UAI": "ND",
          "Relation raison sociale": "ND",
          "Relation état administratif": "ND",
          "Relation réseaux": "ND",
          "Relation adresse": "ND",
          "Relation académie": "ND",
          "Relation région": "ND",
        };
      },
      { parallel: 10 }
    )
  );
}

function streamOrganismesAvecRelations(query, relations) {
  return compose(
    dbCollection("organismes")
      .aggregate([
        {
          $match: query,
        },
        {
          $unwind: "$relations",
        },
        ...(relations.length === 0
          ? []
          : [
              {
                $match: {
                  "relations.type": { $in: relations },
                },
              },
            ]),
      ])
      .stream(),
    transformData(
      async ({ relations: relation, ...organisme }) => {
        const found = relation.referentiel ? await dbCollection("organismes").findOne({ siret: relation.siret }) : null;

        return {
          "Organisme siret": organisme.siret,
          "Organisme UAI": organisme.uai,
          "Organisme raison sociale": organisme.raison_sociale,
          "Organisme état administratif": organisme.etat_administratif,
          "Organisme réseaux": organisme.reseaux.map((r) => r.label).join(", "),
          "Organisme adresse": organisme.adresse?.label,
          "Organisme académie": organisme.adresse?.academie.nom,
          "Organisme région": organisme.adresse?.region.nom,
          "Relation type": relation.type,
          "Relation siret": relation.siret,
          "Relation UAI": found?.uai || "ND",
          "Relation raison sociale": relation.label,
          "Relation état administratif": found?.etat_administratif || "ND",
          "Relation réseaux": found?.reseaux.map((r) => r.label).join(", ") || "ND",
          "Relation adresse": found?.adresse?.label,
          "Relation académie": found?.adresse?.academie.nom,
          "Relation région": found?.adresse?.region.nom,
        };
      },
      { parallel: 10 }
    )
  );
}

function exportReseaux(natures, reseaux, relations) {
  const query = {
    ...(reseaux ? { "reseaux.code": { $in: reseaux } } : {}),
    nature: { $in: natures },
  };

  return compose(
    mergeStreams([streamOrganismesSansRelations(query), streamOrganismesAvecRelations(query, relations)]),
    transformIntoCSV()
  );
}

module.exports = exportReseaux;
