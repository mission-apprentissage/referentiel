const express = require("express");
const { isEmpty, omit, isNil, isBoolean } = require("lodash");
const Boom = require("boom");
const { oleoduc, transformIntoJSON, transformData } = require("oleoduc");
const Joi = require("@hapi/joi");
const { DateTime } = require("luxon");
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

  function convertNaturesIntoQuery(criteria) {
    return criteria.reduce(
      (acc, c) => {
        let results = c.split("|").filter((v) => !v.startsWith("-"));
        acc.$or.push(results.length > 1 ? { natures: { $all: results } } : { natures: results });
        return acc;
      },
      { $or: [] }
    );
  }

  function buildQuery(params) {
    let {
      sirets,
      uais,
      departements = [],
      natures = [],
      regions = [],
      academies = [],
      text,
      anomalies,
      uai_potentiels,
      relations,
      etat_administratif,
      qualiopi,
      numero_declaration_activite: nda,
      nouveaux,
    } = params;

    let hasValue = (v) => !isNil(v);
    let hasElements = (array) => array.length > 0;
    let minNewDate = DateTime.fromISO("2022-01-01").toJSDate();

    return {
      ...(hasValue(sirets) ? (isBoolean(sirets) ? { siret: { $exists: true } } : { siret: { $in: sirets } }) : {}),
      ...(hasValue(uais) ? (isBoolean(uais) ? { uai: { $exists: uais } } : { uai: { $in: uais } }) : {}),
      ...(hasValue(nda)
        ? isBoolean(nda)
          ? { numero_declaration_activite: { $exists: nda } }
          : { numero_declaration_activite: nda }
        : {}),
      ...(hasElements(departements) ? { "adresse.departement.code": { $in: departements } } : {}),
      ...(hasElements(natures) ? convertNaturesIntoQuery(natures) : {}),
      ...(hasElements(regions) ? { "adresse.region.code": { $in: regions } } : {}),
      ...(hasElements(academies) ? { "adresse.academie.code": { $in: academies } } : {}),
      ...(hasValue(relations)
        ? isBoolean(relations)
          ? { "relations.0": { $exists: relations } }
          : { "relations.type": { $in: relations } }
        : {}),
      ...(hasValue(uai_potentiels)
        ? isBoolean(uai_potentiels)
          ? { "uai_potentiels.0": { $exists: uai_potentiels } }
          : { "uai_potentiels.uai": { $in: uai_potentiels } }
        : {}),
      ...(hasValue(etat_administratif) ? { etat_administratif } : {}),
      ...(hasValue(text) ? { $text: { $search: text } } : {}),
      ...(hasValue(anomalies) ? { "_meta.anomalies.0": { $exists: anomalies } } : {}),
      ...(hasValue(qualiopi) ? { qualiopi } : {}),
      ...(hasValue(nouveaux)
        ? nouveaux
          ? { uai: { $exists: false }, "_meta.import_date": { $gt: minNewDate } }
          : { $or: [{ uai: { $exists: true } }, { uai: { $exists: false }, "_meta.import_date": { $lt: minNewDate } }] }
        : {}),
    };
  }

  router.get(
    "/api/v1/organismes",
    checkOptionnalApiToken(),
    tryCatch(async (req, res) => {
      let { page, items_par_page, ordre, champs, ...params } = await Joi.object({
        sirets: Joi.alternatives()
          .try(Joi.boolean(), arrayOf(Joi.string().pattern(/^([0-9]{9}|[0-9]{14})$/)))
          .default(null),
        uais: Joi.alternatives()
          .try(Joi.boolean(), arrayOf(Joi.string().pattern(/^[0-9]{7}[A-Z]{1}$/)))
          .default(null),
        uai_potentiels: Joi.alternatives()
          .try(Joi.boolean(), arrayOf(Joi.string().pattern(/^[0-9]{7}[A-Z]{1}$/)))
          .default(null),
        numero_declaration_activite: Joi.alternatives().try(Joi.boolean(), Joi.string()).default(null),
        natures: arrayOf(Joi.string()).default([]),
        etat_administratif: Joi.string().valid("actif", "fermé"),
        regions: arrayOf(Joi.string().valid(...getRegions().map((r) => r.code))),
        academies: arrayOf(Joi.string().valid(...getAcademies().map((r) => r.code))),
        departements: arrayOf(Joi.string().valid(...getDepartements().map((d) => d.code))).default([]),
        relations: Joi.alternatives()
          .try(
            Joi.boolean(),
            arrayOf(Joi.string().valid("formateur->responsable", "responsable->formateur", "entreprise"))
          )
          .default(null),
        anomalies: Joi.boolean().default(null),
        qualiopi: Joi.boolean().default(null),
        nouveaux: Joi.boolean().default(null),
        text: Joi.string(),
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
