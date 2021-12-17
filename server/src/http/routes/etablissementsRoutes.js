const express = require("express");
const { isEmpty, omit, isNil, isBoolean } = require("lodash");
const Boom = require("boom");
const { oleoduc, transformIntoJSON, transformData } = require("oleoduc");
const Joi = require("@hapi/joi");
const { aggregateAndPaginate } = require("../../common/utils/dbUtils");
const { sendJsonStream } = require("../utils/httpUtils");
const buildProjection = require("../utils/buildProjection");
const { stringList } = require("../utils/validators");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { dbCollection } = require("../../common/db/mongodb");
const validateUAI = require("../../common/actions/validateUAI");
const { checkApiToken, checkOptionnalApiToken } = require("../middlewares/authMiddleware");
const canEditEtablissement = require("../../common/actions/canEditEtablissement");
const { getRegions } = require("../../common/regions");
const { getAcademies } = require("../../common/academies");
const { getDepartements } = require("../../common/departements");

module.exports = () => {
  const router = express.Router();

  function toDto(etablissement) {
    return {
      ...omit(etablissement, ["_id"]),
      ...(etablissement._meta
        ? {
            _meta: {
              ...etablissement._meta,
              validation: etablissement.uai
                ? "VALIDEE"
                : etablissement.uai_potentiels.length > 0
                ? "A_VALIDER"
                : "INCONNUE",
            },
          }
        : {}),
    };
  }

  function buildQuery(params) {
    let {
      siret,
      uai,
      departements = [],
      statuts = [],
      region,
      academie,
      text,
      anomalies,
      uai_potentiel,
      numero_declaration_activite: nda,
    } = params;

    return {
      ...(siret ? { siret } : {}),
      ...(!isNil(uai) ? (isBoolean(uai) ? { uai: { $exists: uai } } : { uai }) : {}),
      ...(!isNil(nda)
        ? isBoolean(nda)
          ? { numero_declaration_activite: { $exists: nda } }
          : { numero_declaration_activite: nda }
        : {}),
      ...(departements.length === 0 ? {} : { "adresse.departement.code": { $in: departements } }),
      ...(statuts.length === 0 ? {} : { statuts: { $in: statuts } }),
      ...(region ? { "adresse.region.code": region } : {}),
      ...(academie ? { "adresse.academie.code": academie } : {}),
      ...(text ? { $text: { $search: text } } : {}),
      ...(!isNil(anomalies) ? { "_meta.anomalies.0": { $exists: anomalies } } : {}),
      ...(!isNil(uai_potentiel)
        ? isBoolean(uai_potentiel)
          ? { "uai_potentiels.0": { $exists: uai_potentiel } }
          : { "uai_potentiels.uai": uai_potentiel }
        : {}),
    };
  }

  function findEtablissements(params) {
    let { page, items_par_page, ordre, champs } = params;
    let query = buildQuery(params);
    let projection = buildProjection(champs);

    return aggregateAndPaginate(
      dbCollection("etablissements"),
      query,
      [
        { $sort: { ["_meta.created_at"]: ordre === "asc" ? 1 : -1 } },
        ...(isEmpty(projection) ? [] : [{ $project: projection }]),
      ],
      {
        page,
        limit: items_par_page,
      }
    );
  }

  router.get(
    "/api/v1/etablissements",
    checkOptionnalApiToken(),
    tryCatch(async (req, res) => {
      let params = await Joi.object({
        uai: Joi.alternatives()
          .try(Joi.boolean(), Joi.string().pattern(/^[0-9]{7}[A-Z]{1}$/))
          .default(null),
        siret: Joi.string().pattern(/^([0-9]{9}|[0-9]{14})$/),
        numero_declaration_activite: Joi.alternatives().try(Joi.boolean(), Joi.string()).default(null),
        statuts: stringList(Joi.string().valid("gestionnaire", "formateur")).default([]),
        region: Joi.string().valid(...getRegions().map((r) => r.code)),
        academie: Joi.string().valid(...getAcademies().map((r) => r.code)),
        departements: stringList(Joi.string().valid(...getDepartements().map((d) => d.code))).default([]),
        anomalies: Joi.boolean().default(null),
        //Misc
        champs: stringList().default([]),
        uai_potentiel: Joi.alternatives()
          .try(Joi.boolean(), Joi.string().pattern(/^[0-9]{7}[A-Z]{1}$/))
          .default(null),
        //Pagination
        page: Joi.number().default(1),
        items_par_page: Joi.number().default(10),
        //Misc
        ordre: Joi.string().valid("asc", "desc").default("desc"),
        text: Joi.string(),
      }).validateAsync(req.query, { abortEarly: false });

      let { aggregate, pagination } = await findEtablissements(params);

      sendJsonStream(
        oleoduc(
          aggregate.stream(),
          transformData((data) => toDto(data)),
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

      return res.json(toDto(etablissement));
    })
  );

  router.put(
    "/api/v1/etablissements/:siret/validateUAI",
    checkApiToken(),
    tryCatch(async (req, res) => {
      let user = req.user;
      let { siret, uai } = await Joi.object({
        siret: Joi.string()
          .pattern(/^[0-9]{14}$/)
          .required(),
        uai: Joi.string()
          .pattern(/^[0-9]{7}[A-Z]{1}$/)
          .required(),
      }).validateAsync({ ...req.params, ...req.body }, { abortEarly: false });

      if (!(await canEditEtablissement(siret, user))) {
        throw Boom.badRequest("Vous ne pouvez pas modifier cet établissement");
      }

      let etablissement = await validateUAI(siret, uai, user.code);

      if (!etablissement) {
        throw Boom.notFound("Siret inconnu");
      }

      return res.json(toDto(etablissement));
    })
  );

  return router;
};
