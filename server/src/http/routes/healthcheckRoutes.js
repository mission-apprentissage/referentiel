const Boom = require("boom");
const express = require("express");
const logger = require("../../common/logger");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { dbCollection } = require("../../common/db/mongodb");

module.exports = () => {
  const router = express.Router();

  router.get(
    "/api/v1/healthcheck",
    tryCatch(async (req, res) => {
      let mongodbStatus;
      await dbCollection("acce")
        .stats()
        .then(() => {
          mongodbStatus = true;
        })
        .catch((e) => {
          mongodbStatus = false;
          logger.error(e, "Healthcheck failed");
        });

      return res.json({
        healthcheck: mongodbStatus,
      });
    })
  );

  router.get(
    "/api/v1/healthcheck/error",
    tryCatch(() => {
      throw Boom.internal();
    })
  );

  return router;
};
