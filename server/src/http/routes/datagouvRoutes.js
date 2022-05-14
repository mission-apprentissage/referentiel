const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { dbCollection } = require("../../common/db/mongodb");
const { sendJsonStream } = require("../utils/httpUtils");
const { oleoduc, transformIntoJSON } = require("oleoduc");
const { findAndPaginate } = require("../../common/utils/dbUtils");
const Joi = require("@hapi/joi");
const Boom = require("boom");

module.exports = () => {
  const router = express.Router();

  router.get(
    "/api/v1/datagouv",
    tryCatch(async (req, res) => {
      const { page, ordre, items_par_page } = await Joi.object({
        page: Joi.number().default(1),
        items_par_page: Joi.number().default(10),
        ordre: Joi.string().valid("asc", "desc").default("desc"),
      }).validateAsync(req.query, { abortEarly: false });

      const { find, pagination } = await findAndPaginate(
        dbCollection("datagouv"),
        {},
        {
          page,
          limit: items_par_page,
          sort: { siretEtablissementDeclarant: ordre === "asc" ? 1 : -1 },
          projection: { _id: 0 },
        }
      );

      sendJsonStream(
        oleoduc(
          find.stream(),
          transformIntoJSON({
            arrayPropertyName: "organismes",
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
    "/api/v1/datagouv/:siret",
    tryCatch(async (req, res) => {
      const { siret } = await Joi.object({
        siret: Joi.string()
          .pattern(/^([0-9]{9}|[0-9]{14})$/)
          .required(),
      }).validateAsync(req.params, { abortEarly: false });

      const found = await dbCollection("datagouv").findOne(
        { siretEtablissementDeclarant: siret },
        { projection: { _id: 0 } }
      );

      if (!found) {
        throw Boom.notFound("Siret inconnu");
      }

      res.json(found);
    })
  );

  return router;
};
