const express = require("express");
const { isEmpty } = require("lodash");
const Boom = require("boom");
const { oleoduc, transformIntoJSON } = require("oleoduc");
const Joi = require("@hapi/joi");
const { aggregateAndPaginate } = require("../../common/utils/dbUtils");
const { sendJsonStream } = require("../utils/httpUtils");
const buildProjection = require("../utils/buildProjection");
const { stringList } = require("../utils/validators");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { getAcademies } = require("../../common/academies");
const { getRegions } = require("../../common/regions");
const { dbCollection } = require("../../common/db/mongodb");
const validateUAI = require("../../common/actions/validateUAI");
const { getDepartements } = require("../../common/departements");
const { checkApiToken, checkOptionnalApiToken } = require("../middlewares/authMiddleware");
const canEditEtablissement = require("../../common/actions/canEditEtablissement");

module.exports = () => {
  const router = express.Router();

  function buildQuery(params, filtres = []) {
    let { siret, uai, departements, statuts, region, academie, text, anomalies } = params;
    let departementsUsedAsFilter = filtres.includes("departements") || departements.length === 0;
    let statutsUsedAsFilter = filtres.includes("statuts") || statuts.length === 0;

    return {
      ...(siret ? { siret } : {}),
      ...(uai ? { uai } : {}),
      ...(departementsUsedAsFilter ? {} : { "adresse.departement.code": { $in: departements } }),
      ...(statutsUsedAsFilter ? {} : { statuts: { $in: statuts } }),
      ...(region ? { "adresse.region.code": region } : {}),
      ...(academie ? { "adresse.academie.code": academie } : {}),
      ...(text ? { $text: { $search: text } } : {}),
      ...(anomalies !== null ? { "_meta.anomalies.0": { $exists: anomalies } } : {}),
    };
  }

  function findEtablissements(params) {
    let { page, items_par_page, tri, ordre, champs } = params;
    let query = buildQuery(params);
    let projection = buildProjection(champs);
    let $project = [
      {
        $project: {
          nb_uais: 0,
          nb_relations: 0,
          _id: 0,
        },
      },
      ...(isEmpty(projection) ? [] : [{ $project: projection }]),
    ];
    let $sort = tri
      ? [
          {
            $addFields: {
              nb_uais: { $size: "$uais" },
              nb_relations: { $size: "$relations" },
            },
          },
          { $sort: { [`nb_${tri}`]: ordre === "asc" ? 1 : -1 } },
        ]
      : [{ $sort: { [`_meta.lastUpdate`]: -1 } }];

    return aggregateAndPaginate(dbCollection("etablissements"), query, [...$sort, ...$project], {
      page,
      limit: items_par_page,
    });
  }

  async function getFiltres(params, filtres) {
    let query = buildQuery(params, filtres);

    let array = await dbCollection("etablissements")
      .aggregate([
        { $match: query },
        {
          $facet: {
            departements: [
              {
                $group: {
                  _id: "$adresse.departement.code",
                  departement: { $first: "$adresse.departement" },
                  nombre_de_resultats: { $sum: 1 },
                },
              },
              { $match: { _id: { $ne: null } } },
              {
                $project: {
                  _id: 0,
                  code: "$departement.code",
                  label: "$departement.nom",
                  nombre_de_resultats: "$nombre_de_resultats",
                },
              },
              { $sort: { ["code"]: 1 } },
            ],
            statuts: [
              { $unwind: "$statuts" },
              {
                $group: {
                  _id: "$statuts",
                  statut: { $first: "$statuts" },
                  nombre_de_resultats: { $sum: 1 },
                },
              },
              { $match: { _id: { $ne: null } } },
              {
                $project: {
                  _id: 0,
                  code: "$statut",
                  label: {
                    $cond: {
                      if: { $eq: ["$statut", "formateur"] },
                      then: "UFA",
                      else: "OF-CFA",
                    },
                  },
                  nombre_de_resultats: "$nombre_de_resultats",
                },
              },
              { $sort: { ["code"]: 1 } },
            ],
          },
        },
      ])
      .toArray();

    return array[0];
  }

  router.get(
    "/api/v1/etablissements",
    checkOptionnalApiToken(),
    tryCatch(async (req, res) => {
      let { filtres, ...params } = await Joi.object({
        uai: Joi.string().pattern(/^[0-9]{7}[A-Z]{1}$/),
        siret: Joi.string().pattern(/^([0-9]{9}|[0-9]{14})$/),
        statuts: stringList(Joi.string().valid("gestionnaire", "formateur")).default([]),
        departements: stringList(Joi.string().valid(...getDepartements().map((d) => d.code))).default([]),
        region: Joi.string().valid(...getRegions().map((r) => r.code)),
        academie: Joi.string().valid(...getAcademies().map((r) => r.code)),
        text: Joi.string(),
        anomalies: Joi.boolean().default(null),
        page: Joi.number().default(1),
        items_par_page: Joi.number().default(10),
        tri: Joi.string().valid("uais", "relations"),
        ordre: Joi.string().valid("asc", "desc").default("desc"),
        champs: stringList().default([]),
        filtres: stringList().default([]),
      }).validateAsync(req.query, { abortEarly: false });

      let [{ aggregate, pagination }, availableFilters] = await Promise.all([
        findEtablissements(params),
        getFiltres(params, filtres),
      ]);

      sendJsonStream(
        oleoduc(
          aggregate.stream(),
          transformIntoJSON({
            arrayPropertyName: "etablissements",
            arrayWrapper: {
              pagination,
              filtres: availableFilters,
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
    checkApiToken(),
    tryCatch(async (req, res) => {
      let { siret, uai } = await Joi.object({
        siret: Joi.string()
          .pattern(/^[0-9]{14}$/)
          .required(),
        uai: Joi.string()
          .pattern(/^[0-9]{7}[A-Z]{1}$/)
          .required(),
      }).validateAsync({ ...req.params, ...req.body }, { abortEarly: false });

      if (!(await canEditEtablissement(siret, req.user))) {
        throw Boom.badRequest("Vous ne pouvez pas modifier cet établissement");
      }

      let etablissement = await validateUAI(siret, uai);

      if (!etablissement) {
        throw Boom.notFound("Siret inconnu");
      }

      return res.json(etablissement);
    })
  );

  return router;
};
