const express = require("express");
const { isEmpty } = require("lodash");
const Boom = require("boom");
const { oleoduc, transformIntoJSON } = require("oleoduc");
const Joi = require("@hapi/joi");
const { paginateAggregationWithCursor, paginate } = require("../../common/utils/dbUtils");
const { sendJsonStream } = require("../utils/httpUtils");
const buildProjection = require("../utils/buildProjection");
const { stringList } = require("../utils/validators");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { getAcademies } = require("../../common/academies");
const { getRegions } = require("../../common/regions");
const { dbCollection } = require("../../common/db/mongodb");
const validateUAI = require("../../common/actions/validateUAI");

module.exports = () => {
  const router = express.Router();

  router.get(
    "/api/v1/etablissements",
    tryCatch(async (req, res) => {
      let { siret, uai, academie, region, text, anomalies, page, items_par_page, tri, ordre, champs } =
        await Joi.object({
          uai: Joi.string().pattern(/^[0-9]{7}[A-Z]{1}$/),
          siret: Joi.string().pattern(/^([0-9]{9}|[0-9]{14})$/),
          academie: Joi.string().valid(...getAcademies().map((a) => a.code)),
          region: Joi.string().valid(...getRegions().map((r) => r.code)),
          text: Joi.string(),
          anomalies: Joi.boolean().default(null),
          page: Joi.number().default(1),
          items_par_page: Joi.number().default(10),
          tri: Joi.string().valid("uais", "relations"),
          ordre: Joi.string().valid("asc", "desc").default("desc"),
          champs: stringList().default([]),
        }).validateAsync(req.query, { abortEarly: false });

      let projection = buildProjection(champs);
      let { cursor, pagination } = await paginateAggregationWithCursor(
        dbCollection("etablissements"),
        [
          {
            $match: {
              ...(siret ? { siret } : {}),
              ...(uai ? { uai } : {}),
              ...(academie ? { "adresse.academie.code": academie } : {}),
              ...(region ? { "adresse.region.code": region } : {}),
              ...(text ? { $text: { $search: text } } : {}),
              ...(anomalies !== null ? { "_meta.anomalies.0": { $exists: anomalies } } : {}),
            },
          },
          ...(tri
            ? [
                {
                  $addFields: {
                    nb_uais: { $size: "$uais" },
                    nb_relations: { $size: "$relations" },
                  },
                },
                { $sort: { [`nb_${tri}`]: ordre === "asc" ? 1 : -1 } },
              ]
            : [{ $sort: { [`_meta.lastUpdate`]: -1 } }]),
          {
            $project: {
              nb_uais: 0,
              nb_relations: 0,
              _id: 0,
            },
          },
          ...(isEmpty(projection) ? [] : [{ $project: projection }]),
        ],
        { page, limit: items_par_page }
      );

      sendJsonStream(
        oleoduc(
          cursor,
          transformIntoJSON({
            arrayPropertyName: "etablissements",
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
    "/api/v1/etablissements/:siret",
    tryCatch(async (req, res) => {
      let { siret, champs } = await Joi.object({
        siret: Joi.string()
          .pattern(/^[0-9]{14}$/)
          .required(),
        champs: stringList().default([]),
      }).validateAsync({ ...req.params, ...req.query }, { abortEarly: false });

      let projection = buildProjection(champs);
      let etablissement = await dbCollection("etablissements").findOne({ siret }, { projection });

      if (!etablissement) {
        throw Boom.notFound("Siret inconnu");
      }

      delete etablissement._id;
      delete etablissement._meta;
      return res.json(etablissement);
    })
  );

  router.put(
    "/api/v1/etablissements/:siret/validateUAI",
    tryCatch(async (req, res) => {
      let { siret, uai } = await Joi.object({
        siret: Joi.string()
          .pattern(/^[0-9]{14}$/)
          .required(),
        uai: Joi.string()
          .pattern(/^[0-9]{7}[A-Z]{1}$/)
          .required(),
      }).validateAsync({ ...req.params, ...req.body }, { abortEarly: false });

      let etablissement = await validateUAI(siret, uai);

      if (!etablissement) {
        throw Boom.notFound("Siret inconnu");
      }

      return res.json(etablissement);
    })
  );

  router.get(
    "/api/v1/stats",
    tryCatch(async (req, res) => {
      let { page, limit } = await Joi.object({
        page: Joi.number().default(1),
        limit: Joi.number().default(1),
      }).validateAsync(req.query, { abortEarly: false });

      let { find, pagination } = await paginate(
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
