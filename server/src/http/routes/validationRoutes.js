const express = require("express");
const Joi = require("@hapi/joi");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { dbCollection } = require("../../common/db/mongodb");
const { nullOrEmpty, notEmpty } = require("../../common/db/aggregationUtils");
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

      let filters = await dbCollection("organismes")
        .aggregate([
          {
            $match: {
              etat_administratif: "actif",
              qualiopi: true,
              statuts: { $all: ["gestionnaire", "formateur"] },
              [`adresse.${user.type}.code`]: user.code,
              ...(departements.length > 0 ? { "adresse.departement.code": { $in: departements } } : {}),
            },
          },
          {
            $group: {
              _id: null,
              A_VALIDER: {
                $sum: {
                  $cond: [{ $and: [nullOrEmpty("$uai"), { $gt: [{ $size: "$uai_potentiels" }, 0] }] }, 1, 0],
                },
              },
              A_RENSEIGNER: {
                $sum: {
                  $cond: [{ $and: [nullOrEmpty("$uai"), { $eq: [{ $size: "$uai_potentiels" }, 0] }] }, 1, 0],
                },
              },
              VALIDE: { $sum: { $cond: { if: notEmpty("$uai"), then: 1, else: 0 } } },
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
        validation: filters[0] || {},
      });
    })
  );

  return router;
};
