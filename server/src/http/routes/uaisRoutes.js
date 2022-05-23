const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { dbCollection } = require("../../common/db/mongodb");
const { sendJsonStream } = require("../utils/httpUtils");
const { oleoduc, transformIntoJSON, transformData } = require("oleoduc");
const { findAndPaginate } = require("../../common/utils/dbUtils");
const Joi = require("@hapi/joi");
const Boom = require("boom");

module.exports = () => {
  const router = express.Router();

  router.get(
    "/api/v1/uais",
    tryCatch(async (req, res) => {
      const { page, ordre, items_par_page } = await Joi.object({
        page: Joi.number().default(1),
        items_par_page: Joi.number().default(10),
        ordre: Joi.string().valid("asc", "desc").default("desc"),
      }).validateAsync(req.query, { abortEarly: false });

      const { find, pagination } = await findAndPaginate(
        dbCollection("acce"),
        {},
        {
          page,
          limit: items_par_page,
          sort: { numero_uai: ordre === "asc" ? 1 : -1 },
          projection: { _id: 0, numero_uai: 1 },
        }
      );

      sendJsonStream(
        oleoduc(
          find.stream(),
          transformData((data) => {
            return {
              uai: data.numero_uai,
            };
          }),
          transformIntoJSON({
            arrayPropertyName: "uais",
            arrayWrapper: {
              pagination,
            },
          })
        ),
        res
      );
    })
  );

  router.get(
    "/api/v1/uais/:uai",
    tryCatch(async (req, res) => {
      const { uai } = await Joi.object({
        uai: Joi.string()
          .pattern(/^[0-9]{7}[A-Z]{1}$/)
          .required(),
      }).validateAsync(req.params, { abortEarly: false });

      const found = await dbCollection("acce").findOne({ numero_uai: uai }, { projection: { _id: 0, numero_uai: 1 } });

      if (!found) {
        throw Boom.notFound("UAI inconnu");
      }

      res.json({
        uai: found.numero_uai,
      });
    })
  );

  return router;
};
