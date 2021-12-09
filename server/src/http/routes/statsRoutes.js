const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { dbCollection } = require("../../common/db/mongodb");
const Joi = require("@hapi/joi");
const { findAndPaginate } = require("../../common/utils/dbUtils");
const { oleoduc, transformIntoJSON } = require("oleoduc");
const { sendJsonStream } = require("../utils/httpUtils");

module.exports = () => {
  const router = express.Router();

  router.get(
    "/api/v1/stats",
    tryCatch(async (req, res) => {
      let { page, limit } = await Joi.object({
        page: Joi.number().default(1),
        limit: Joi.number().default(1),
      }).validateAsync(req.query, { abortEarly: false });

      let { find, pagination } = await findAndPaginate(
        dbCollection("stats"),
        {},
        { page, limit, projection: { _id: 0 }, sort: { created_at: -1 } }
      );
      let stream = oleoduc(
        find.stream(),
        transformIntoJSON({
          arrayWrapper: {
            pagination,
          },
          arrayPropertyName: "stats",
        })
      );

      return sendJsonStream(stream, res);
    })
  );

  return router;
};
