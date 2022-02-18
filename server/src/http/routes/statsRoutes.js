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

  return router;
};
