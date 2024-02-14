const Boom = require("boom");
const express = require("express");
const logger = require("../../common/logger");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { dbCollection } = require("../../common/db/mongodb");
const { verifyUser } = require("../middlewares/authMiddleware");
const rateLimiterMiddleware = require("../middlewares/rateLimiterMiddleware");
const { pick } = require("lodash");

module.exports = () => {
  const router = express.Router();

  router.get(
    "/api/v1/healthcheck",
    tryCatch(async (req, res) => {
      let mongodbStatus;
      await dbCollection("organismes")
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

  router.get(
    "/api/v1/healthcheck/auth",
    rateLimiterMiddleware,
    verifyUser,
    tryCatch((req, res) => {
      res.json(pick(req.user, ["code", "type"]));
    })
  );

  return router;
};
