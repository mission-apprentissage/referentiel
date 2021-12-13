const express = require("express");
const Joi = require("@hapi/joi");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { dbCollection } = require("../../common/db/mongodb");
const { nullOrEmpty, notEmpty } = require("../../common/db/aggregation");
const { checkApiToken } = require("../middlewares/authMiddleware");
const { stringList } = require("../utils/validators");

module.exports = () => {
  const router = express.Router();

  router.get(
    "/api/v1/validation",
    checkApiToken(),
    tryCatch(async (req, res) => {
      let user = req.user;
      let { departements } = await Joi.object({
        departements: stringList(Joi.string().valid(...user.departements.map((d) => d.code))).default([]),
      }).validateAsync(req.query, { abortEarly: false });

      let filters = await dbCollection("etablissements")
        .aggregate([
          {
            $match: {
              [`adresse.${user.type}.code`]: user.code,
              ...(departements.length > 0 ? { "adresse.departement.code": { $in: departements } } : {}),
            },
          },
          {
            $group: {
              _id: null,
              A_VALIDER: {
                $sum: {
                  $cond: [{ $and: [nullOrEmpty("$uai"), { $gt: [{ $size: "$uais" }, 0] }] }, 1, 0],
                },
              },
              INCONNUES: {
                $sum: {
                  $cond: [{ $and: [nullOrEmpty("$uai"), { $eq: [{ $size: "$uais" }, 0] }] }, 1, 0],
                },
              },
              VALIDEES: { $sum: { $cond: { if: notEmpty("$uai"), then: 1, else: 0 } } },
            },
          },
          {
            $project: {
              _id: 0,
            },
          },
        ])
        .toArray();

      res.json({
        validation: filters[0],
      });
    })
  );

  return router;
};
