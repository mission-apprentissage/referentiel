const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { dbCollection } = require("../../common/db/mongodb");
const { promiseAllProps } = require("../../common/utils/asyncUtils");
const { notEmpty, nullOrEmpty, arrayHasElements, arrayIsEmpty, sum } = require("../../common/db/aggregationUtils");

module.exports = () => {
  const router = express.Router();

  const GROUPS = {
    national: {
      field: null,
    },
    academies: {
      field: "$adresse.academie",
      stages: [
        {
          $set: {
            academie: {
              $cond: {
                if: nullOrEmpty("$_id"),
                then: { code: "XX", nom: "Inconnu" },
                else: "$_id",
              },
            },
          },
        },
        { $sort: { "academie.nom": 1 } },
      ],
    },
  };

  router.get(
    "/api/v1/stats/couverture",
    tryCatch(async (req, res) => {
      let stats = await promiseAllProps({
        total: dbCollection("organismes").count(),
        valides: dbCollection("organismes").count({ uai: { $exists: true } }),
      });

      res.json(stats);
    })
  );

  router.get(
    "/api/v1/stats/natures",
    tryCatch(async (req, res) => {
      function groupNaturesBy({ field, stages = [] }) {
        return dbCollection("organismes")
          .aggregate([
            {
              $group: {
                _id: field,
                formateur: {
                  $sum: sum({ $eq: ["$nature", "formateur"] }),
                },
                responsable: {
                  $sum: sum({ $eq: ["$nature", "responsable"] }),
                },
                responsable_formateur: {
                  $sum: sum({ $eq: ["$nature", "responsable_formateur"] }),
                },
                inconnu: {
                  $sum: sum(nullOrEmpty("$nature")),
                },
              },
            },
            ...stages,
            {
              $project: {
                _id: 0,
              },
            },
          ])
          .toArray();
      }

      res.json(
        await promiseAllProps({
          national: groupNaturesBy(GROUPS.national).then((array) => array[0]),
          academies: groupNaturesBy(GROUPS.academies),
        })
      );
    })
  );

  router.get(
    "/api/v1/stats/validation",
    tryCatch(async (req, res) => {
      function groupValidationBy({ field, stages = [] }) {
        return dbCollection("organismes")
          .aggregate([
            {
              $match: {
                etat_administratif: "actif",
                qualiopi: true,
                $or: [{ nature: "responsable" }, { nature: "responsable_formateur" }],
              },
            },
            {
              $group: {
                _id: field,
                VALIDE: {
                  $sum: sum(notEmpty("$uai")),
                },
                A_VALIDER: {
                  $sum: sum({
                    $and: [nullOrEmpty("$uai"), arrayHasElements("$uai_potentiels")],
                  }),
                },
                A_RENSEIGNER: {
                  $sum: sum({
                    $and: [nullOrEmpty("$uai"), arrayIsEmpty("$uai_potentiels")],
                  }),
                },
              },
            },
            ...stages,
            {
              $project: {
                _id: 0,
              },
            },
          ])
          .toArray();
      }

      res.json(
        await promiseAllProps({
          national: groupValidationBy(GROUPS.national).then((array) => array[0]),
          academies: groupValidationBy(GROUPS.academies),
        })
      );
    })
  );

  router.get(
    "/api/v1/stats/qualiopi",
    tryCatch(async (req, res) => {
      let results = await dbCollection("organismes")
        .aggregate([
          {
            $group: {
              _id: "$nature",
              nature: { $first: "$nature" },
              qualiopi: {
                $sum: sum({ $eq: ["$qualiopi", true] }),
              },
              non_qualiopi: {
                $sum: sum({ $eq: ["$qualiopi", false] }),
              },
            },
          },
          {
            $set: {
              nature: {
                $cond: {
                  if: nullOrEmpty("$nature"),
                  then: "inconnu",
                  else: "$nature",
                },
              },
            },
          },
          { $sort: { nature: 1 } },
          {
            $project: {
              _id: 0,
            },
          },
        ])
        .toArray();

      res.json(results);
    })
  );

  router.get(
    "/api/v1/stats/nouveaux",
    tryCatch(async (req, res) => {
      let stats = await dbCollection("organismes")
        .aggregate([
          {
            $match: {
              qualiopi: true,
              $or: [{ nature: "responsable" }, { nature: "responsable_formateur" }],
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$_meta.date_import" },
                month: { $month: "$_meta.date_import" },
              },
              total: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              annee: "$_id.year",
              mois: "$_id.month",
              total: 1,
            },
          },
        ])
        .toArray();

      res.json(stats);
    })
  );

  router.get(
    "/api/v1/stats/etat_administratif",
    tryCatch(async (req, res) => {
      res.json(
        await promiseAllProps({
          actif: dbCollection("organismes").count({ etat_administratif: "actif" }),
          fermé: dbCollection("organismes").count({ etat_administratif: "fermé" }),
        })
      );
    })
  );

  return router;
};
