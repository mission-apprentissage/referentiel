const Boom = require("boom");
const express = require("express");
const logger = require("../../common/logger");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { getCollection } = require("../../common/db/mongodb");

module.exports = () => {
  const router = express.Router();

  router.get(
    "/api/healthcheck",
    tryCatch(async (req, res) => {
      let mongodbStatus;
      await getCollection("acce")
        .stats()
        .then(() => {
          mongodbStatus = true;
        })
        .catch((e) => {
          mongodbStatus = false;
          logger.error("Healthcheck failed", e);
        });

      return res.json({
        healthcheck: mongodbStatus,
      });
    })
  );

  router.get(
    "/api/healthcheck/error",
    tryCatch(() => {
      throw Boom.internal();
    })
  );

  return router;
};
