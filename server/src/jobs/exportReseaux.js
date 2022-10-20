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

async function generateGraph(options = {}) {
  const organismes = await dbCollection("organismes")
    .find(
      {
        ...(options.reseaux ? { "reseaux.code": { $in: options.reseaux } } : {}),
        ...(options.academies ? { "adresse.academie.code": { $in: options.academies } } : {}),
      },
      { projection: { siret: 1, uai: 1, relations: 1, raison_sociale: 1, nature: 1 } }
    )
    .toArray();

  function getOrganismeLabel(organisme) {
    const raisonSociale = organisme.raison_sociale.replace(/"/g, "");
    const uai = organisme.uai || "ND";
    return `${organisme.siret}|{${uai}|${raisonSociale}|${organisme.nature}}`;
  }

  function getOrganismeColor(organisme) {
    const nature = organisme.nature;
    if (nature === "responsable") {
      return "blue";
    } else if (nature === "responsable_formateur") {
      return "purple";
    } else {
      return "green";
    }
  }

  function getRelationLine(relation) {
    const type = relation.type;
    if (type === "formateur->responsable") {
      return "bold";
    } else if (type === "responsable->formateur") {
      return "dotted";
    } else if (type === "entreprise") {
      return "dashed";
    } else {
      return "dotted";
    }
  }

  return `
digraph D {
 
    node [shape=hexagon color=red]
 
    ${organismes
      .map((o) => {
        const href = `https://referentiel.apprentissage.onisep.fr/organismes/${o.siret}`;
        const label = getOrganismeLabel(o);
        const color = getOrganismeColor(o);
        return `${o.siret} [shape=record color="${color}" label="${label}" href="${href}"]`;
      })
      .join("\n")}
    
    ${organismes
      .flatMap((o) => {
        return o.relations.map((r) => {
          return `${o.siret} -> ${r.siret} [style=${getRelationLine(r)}]`;
        });
      })
      .join("\n")}
}  
`;
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

module.exports = { exportReseaux, generateGraph };
