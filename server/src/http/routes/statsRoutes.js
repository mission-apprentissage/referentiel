const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { dbCollection } = require("../../common/db/mongodb");
const { promiseAllProps } = require("../../common/utils/asyncUtils");
const { notEmpty, nullOrEmpty, arrayHasElements, arrayIsEmpty, sum } = require("../../common/db/aggregationUtils");
const Joi = require("@hapi/joi");
const { arrayOf } = require("../utils/validators.js");

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
                then: { code: false, nom: "Inconnu" },
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
      const validationQuery = {
        etat_administratif: "actif",
        qualiopi: true,
        nature: { $in: ["formateur", "responsable", "responsable_formateur"] },
      };

      const stats = await promiseAllProps({
        organismes: dbCollection("organismes").countDocuments(),
        total: dbCollection("organismes").countDocuments(validationQuery),
        valides: dbCollection("organismes").countDocuments({
          ...validationQuery,
          uai: { $exists: true },
        }),
        uaiExistant: dbCollection("organismes").countDocuments({
          uai: { $exists: true },
        }),
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
                inconnue: {
                  $sum: sum({ $eq: ["$nature", "inconnue"] }),
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
      const { natures } = await Joi.object({
        natures: arrayOf(Joi.string().valid("responsable", "formateur", "responsable_formateur", "inconnue")).default(
          []
        ),
      }).validateAsync(req.query, { abortEarly: false });

      function groupValidationBy(group) {
        const { field, stages = [] } = group;

        return dbCollection("organismes")
          .aggregate([
            {
              $match: {
                ...(natures.length > 0 ? { nature: { $in: natures } } : {}),
                etat_administratif: "actif",
                qualiopi: true,
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
      const results = await dbCollection("organismes")
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
      const stats = await dbCollection("organismes")
        .aggregate([
          {
            $match: {
              qualiopi: true,
              nature: { $in: ["responsable", "responsable_formateur"] },
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
