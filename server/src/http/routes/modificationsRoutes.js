const express = require("express");
const Joi = require("@hapi/joi");
const { oleoduc, transformIntoJSON } = require("oleoduc");

const tryCatch = require("../middlewares/tryCatchMiddleware");
const { sendJsonStream } = require("../utils/httpUtils");

const { verifyUser, isUserAdmin } = require("../middlewares/authMiddleware");
const { dbCollection } = require("../../common/db/mongodb");
const { findAndPaginate } = require("../../common/utils/dbUtils");

module.exports = () => {
  const router = express.Router();

  router.get(
    "/api/v1/modifications/",
    verifyUser,
    isUserAdmin,
    tryCatch(async (req, res) => {
      const { page, ordre, items_par_page } = await Joi.object({
        page: Joi.number().default(1),
        items_par_page: Joi.number().default(10),
        ordre: Joi.string().valid("asc", "desc").default("desc"),
      }).validateAsync(req.query, { abortEarly: false });

      const { find, pagination } = await findAndPaginate(
        await dbCollection("modifications"),
        {},
        {
          page,
          limit: items_par_page,
          sort: { date: ordre === "asc" ? 1 : -1 },
          projection: { _id: 0 },
        }
      );

      sendJsonStream(
        oleoduc(
          find.stream(),
          transformIntoJSON({
            arrayPropertyName: "modifications",
            arrayWrapper: {
              pagination,
            },
          })
        ),
        res
      );
    })
  );

  return router;
};
