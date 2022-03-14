const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { dbCollection } = require("../../common/db/mongodb");
const { promiseAllProps } = require("../../common/utils/asyncUtils");

module.exports = () => {
  const router = express.Router();

  router.get(
    "/api/v1/stats",
    tryCatch(async (req, res) => {
      let stats = await promiseAllProps({
        total: dbCollection("organismes").count(),
        valides: dbCollection("organismes").count({ uai: { $exists: true } }),
      });

      res.json(stats);
    })
  );

  router.get(
    "/api/v1/stats/entrants_sortants",
    tryCatch(async (req, res) => {
      function groupByDate(fieldName, match = {}) {
        return dbCollection("organismes")
          .aggregate([
            {
              $match: {
                qualiopi: true,
                $or: [{ nature: "responsable" }, { nature: "responsable_formateur" }],
                ...match,
              },
            },
            {
              $group: {
                _id: {
                  year: { $year: fieldName },
                  month: { $month: fieldName },
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
      }

      let stats = await promiseAllProps({
        entrants: groupByDate("$_meta.date_import"),
        sortants: groupByDate("$_meta.date_sortie", {
          etat_administratif: "fermé",
        }),
      });

      res.json(stats);
    })
  );

  return router;
};
