const express = require("express");
const { isEmpty, omit, isNil, isBoolean } = require("lodash");
const Boom = require("boom");
const { oleoduc, transformIntoJSON, transformData } = require("oleoduc");
const Joi = require("@hapi/joi");
const { findAndPaginate } = require("../../common/utils/dbUtils");
const { sendJsonStream } = require("../utils/httpUtils");
const validators = require("../utils/validators");
const buildProjection = require("../utils/buildProjection");
const { arrayOf } = require("../utils/validators");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { dbCollection } = require("../../common/db/mongodb");
const setUAI = require("../../common/actions/setUAI");
const { checkApiToken, checkOptionnalApiToken } = require("../middlewares/authMiddleware");
const canEditOrganisme = require("../middlewares/canEditOrganismeMiddleware");
const { getRegions } = require("../../common/regions");
const { getAcademies } = require("../../common/academies");
const { getDepartements } = require("../../common/departements");
const addModification = require("../../common/actions/addModification");
const findBestUAIPotentiel = require("../../common/actions/findBestUAIPotentiel");

module.exports = () => {
  const router = express.Router();

  function toDto(organisme) {
    const best = organisme.uai_potentiels && findBestUAIPotentiel(organisme);
    return {
      ...omit(organisme, ["_id"]),
      ...(organisme._meta
        ? {
            _meta: {
              ...organisme._meta,
              ...(best ? { uai_probale: best.uai } : {}),
            },
          }
        : {}),
    };
  }

  function mapTypesToQuery(types) {
    return {
      $or: types.map((type) => {
        switch (type) {
          case "of-cfa":
            return { natures: { $all: ["responsable", "formateur"] } };
          case "ufa":
            return { natures: ["formateur"] };
          case "entite-administrative":
            return { natures: ["responsable"] };
          default:
            throw Boom.badRequest(`${type} inconnu`);
        }
      }),
    };
  }

  function buildQuery(params) {
    let {
      siret,
      uai,
      departements = [],
      natures = [],
      types = [],
      region,
      academie,
      text,
      anomalies,
      uai_potentiels,
      etat_administratif,
      qualiopi,
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
      ...(natures.length === 0 ? {} : { natures: { $in: natures } }),
      ...(types.length === 0 ? {} : mapTypesToQuery(types)),
      ...(etat_administratif ? { etat_administratif: etat_administratif } : {}),
      ...(region ? { "adresse.region.code": region } : {}),
      ...(academie ? { "adresse.academie.code": academie } : {}),
      ...(text ? { $text: { $search: text } } : {}),
      ...(!isNil(anomalies) ? { "_meta.anomalies.0": { $exists: anomalies } } : {}),
      ...(!isNil(qualiopi) ? { qualiopi } : {}),
      ...(!isNil(uai_potentiels)
        ? isBoolean(uai_potentiels)
          ? { "uai_potentiels.0": { $exists: uai_potentiels } }
          : { "uai_potentiels.uai": { $in: uai_potentiels } }
        : {}),
    };
  }

  router.get(
    "/api/v1/organismes",
    checkOptionnalApiToken(),
    tryCatch(async (req, res) => {
      let { page, items_par_page, ordre, champs, ...params } = await Joi.object({
        siret: Joi.string().pattern(/^([0-9]{9}|[0-9]{14})$/),
        uai: Joi.alternatives()
          .try(Joi.boolean(), Joi.string().pattern(/^[0-9]{7}[A-Z]{1}$/))
          .default(null),
        uai_potentiels: Joi.alternatives()
          .try(Joi.boolean(), arrayOf(Joi.string().pattern(/^[0-9]{7}[A-Z]{1}$/)))
          .default(null),
        numero_declaration_activite: Joi.alternatives().try(Joi.boolean(), Joi.string()).default(null),
        natures: arrayOf(Joi.string().valid("responsable", "formateur")).default([]),
        etat_administratif: Joi.string().valid("actif", "fermé"),
        region: Joi.string().valid(...getRegions().map((r) => r.code)),
        academie: Joi.string().valid(...getAcademies().map((r) => r.code)),
        departements: arrayOf(Joi.string().valid(...getDepartements().map((d) => d.code))).default([]),
        anomalies: Joi.boolean().default(null),
        qualiopi: Joi.boolean().default(null),
        types: arrayOf(Joi.string().valid("of-cfa", "ufa", "entite-administrative")),
        text: Joi.string(),
        //Misc
        ...validators.champs(),
        ...validators.pagination(),
        ...validators.tri(),
      }).validateAsync(req.query, { abortEarly: false });

      let query = buildQuery(params);
      let projection = buildProjection(champs);

      let { find, pagination } = await findAndPaginate(dbCollection("organismes"), query, {
        page,
        limit: items_par_page,
        sort: { ["_meta.import_date"]: ordre === "asc" ? 1 : -1 },
        ...(isEmpty(projection) ? {} : { projection }),
      });

      sendJsonStream(
        oleoduc(
          find.stream(),
          transformData((data) => toDto(data)),
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
    "/api/v1/organismes/:siret",
    tryCatch(async (req, res) => {
      let { siret, champs } = await Joi.object({
        siret: Joi.string()
          .pattern(/^[0-9]{14}$/)
          .required(),
        champs: arrayOf().default([]),
      }).validateAsync({ ...req.params, ...req.query }, { abortEarly: false });

      let projection = buildProjection(champs);
      let organisme = await dbCollection("organismes").findOne({ siret }, { projection });

      if (!organisme) {
        throw Boom.notFound("Siret inconnu");
      }

      return res.json(toDto(organisme));
    })
  );

  router.put(
    "/api/v1/organismes/:siret/setUAI",
    checkApiToken(),
    canEditOrganisme(),
    tryCatch(async (req, res) => {
      let user = req.user;
      let auteur = `${user.type}-${user.code}`;
      let { uai } = await Joi.object({
        uai: Joi.string()
          .pattern(/^[0-9]{7}[A-Z]{1}$/)
          .required(),
      }).validateAsync(req.body, { abortEarly: false });

      await addModification(auteur, req.organisme, { uai });
      let updated = await setUAI(req.organisme, uai, auteur);

      if (!updated) {
        throw Boom.notFound("Siret inconnu");
      }

      return res.json(toDto(updated));
    })
  );

  return router;
};
