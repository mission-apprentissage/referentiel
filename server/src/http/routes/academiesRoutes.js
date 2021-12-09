const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { getAcademies } = require("../../common/academies");
const { sortBy } = require("lodash");

module.exports = () => {
  const router = express.Router();

  router.get(
    "/api/v1/academies",
    tryCatch(async (req, res) => {
      return res.json({ academies: sortBy(getAcademies(), (a) => a.nom) });
    })
  );

  return router;
};
