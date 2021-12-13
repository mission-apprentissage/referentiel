const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { getAcademies } = require("../../common/academies");
const { sortBy } = require("lodash");
const { getDepartements } = require("../../common/departements");
const { getRegions } = require("../../common/regions");

module.exports = () => {
  const router = express.Router();

  router.get(
    "/api/v1/data",
    tryCatch(async (req, res) => {
      return res.json({
        regions: sortBy(getRegions(), (a) => a.nom),
        academies: sortBy(getAcademies(), (a) => a.nom),
        departements: sortBy(getDepartements(), (a) => a.nom),
      });
    })
  );

  return router;
};
