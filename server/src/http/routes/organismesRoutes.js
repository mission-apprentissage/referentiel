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
const { verifyUser } = require("../middlewares/authMiddleware");
const canEditOrganisme = require("../middlewares/canEditOrganismeMiddleware");
const rateLimiterMiddleware = require("../middlewares/rateLimiterMiddleware");
const { getRegions } = require("../../common/regions");
const { getAcademies } = require("../../common/academies");
const { getDepartements } = require("../../common/departements");
const { addModification } = require("../../common/actions/addModification");
const findUAIProbable = require("../../common/actions/findUAIProbable");
const transformOrganisme = require("../../common/actions/transformOrganisme");
const { addCsvHeaders } = require("../../common/utils/httpUtils");

module.exports = () => {
  const router = express.Router();
  const nouveauFeatureDate = DateTime.fromISO("2022-03-20").toJSDate();

  function toDto(organisme) {
    const probable = organisme.uai_potentiels && findUAIProbable(organisme);
    return {
      ...omit(organisme, ["_id"]),
      ...(organisme._meta
        ? {
            _meta: {
              ...organisme._meta,
              ...(probable ? { uai_probable: probable.uai } : {}),
              nouveau: !organisme.uai && organisme._meta.date_import > nouveauFeatureDate,
            },
          }
        : {}),
    };
  }

  function convertCriteriaIntoQuery(fieldName, criteria) {
    const query = { $and: [] };

    const includes = criteria.filter((v) => !v.startsWith("-"));
    if (includes.length > 0) {
      query.$and.push({ [fieldName]: { $in: includes } });
    }

    const excludes = criteria.filter((v) => v.startsWith("-")).map((v) => v.substring(1, v.length));
    if (excludes.length > 0) {
      query.$and.push({ [fieldName]: { $nin: excludes } });
    }

    return query;
  }

  /** Supprime les caractères spéciaux pour une expression régulière */
  function escapeRegex(input) {
    return input.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  function buildQuery(params) {
    const {
      sirets,
      uais,
      departements = [],
      regions = [],
      academies = [],
      natures = [],
      reseaux = [],
      referentiels = [],
      text,
      anomalies,
      uai_potentiels,
      relations,
      etat_administratif,
      qualiopi,
      numero_declaration_activite: nda,
      nouveaux,
    } = params;

    const hasValue = (v) => !isNil(v);
    const hasElements = (array) => array.length > 0;

    return {
      ...(hasValue(sirets) ? (isBoolean(sirets) ? { siret: { $exists: true } } : { siret: { $in: sirets } }) : {}),
      ...(hasValue(uais) ? (isBoolean(uais) ? { uai: { $exists: uais } } : { uai: { $in: uais } }) : {}),
      ...(hasValue(nda)
        ? isBoolean(nda)
          ? { numero_declaration_activite: { $exists: nda } }
          : { numero_declaration_activite: nda }
        : {}),
      ...(hasElements(natures) ? { nature: { $in: natures } } : {}),
      ...(hasElements(reseaux) ? { "reseaux.code": { $in: reseaux } } : {}),
      ...(hasElements(referentiels) ? convertCriteriaIntoQuery("referentiels", referentiels) : {}),
      ...(hasElements(departements) ? { "adresse.departement.code": { $in: departements } } : {}),
      ...(hasElements(regions) ? { "adresse.region.code": { $in: regions } } : {}),
      ...(hasValue(academies)
        ? isBoolean(academies)
          ? { "adresse.academie.code": { $exists: academies } }
          : { "adresse.academie.code": { $in: academies } }
        : {}),
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
      ...(hasValue(text)
        ? { $or: [{ $text: { $search: text } }, { siret: { $regex: new RegExp(`^${escapeRegex(text)}\\s*\\d{5}$`) } }] }
        : {}),
      ...(hasValue(anomalies) ? { "_meta.anomalies.0": { $exists: anomalies } } : {}),
      ...(hasValue(qualiopi) ? { qualiopi } : {}),
      ...(hasValue(nouveaux)
        ? nouveaux
          ? { "uai": { $exists: false }, "_meta.date_import": { $gt: nouveauFeatureDate } }
          : {
              $or: [
                { uai: { $exists: true } },
                { "uai": { $exists: false }, "_meta.date_import": { $lt: nouveauFeatureDate } },
              ],
            }
        : {}),
    };
  }

  ["get", "post"].forEach((method) => {
    router[method](
      "/api/v1/organismes.:ext?",
      tryCatch(async (req, res) => {
        const { page, items_par_page, ordre, champs, ext, ...params } = await Joi.object({
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
          natures: arrayOf(Joi.string().valid("responsable", "formateur", "responsable_formateur", "inconnue")),
          reseaux: arrayOf(Joi.string()),
          etat_administratif: Joi.string().valid("actif", "fermé"),
          regions: arrayOf(Joi.string().valid(...getRegions().map((r) => r.code))),
          academies: Joi.alternatives()
            .try(Joi.boolean(), arrayOf(Joi.string().valid(...getAcademies().map((a) => a.code))))
            .default(null),
          departements: arrayOf(Joi.string().valid(...getDepartements().map((d) => d.code))),
          relations: Joi.alternatives()
            .try(
              Joi.boolean(),
              arrayOf(Joi.string().valid("formateur->responsable", "responsable->formateur", "entreprise"))
            )
            .default(null),
          referentiels: Joi.alternatives().try(Joi.boolean(), arrayOf(Joi.string())),
          nouveaux: Joi.boolean().default(null),
          qualiopi: Joi.boolean().default(null),
          text: Joi.string(),
          anomalies: Joi.boolean().default(null),
          ...validators.champs(),
          ...validators.pagination(),
          ...validators.tri(),
          ...validators.exports(),
        }).validateAsync({ ...req[method === "post" ? "body" : "query"], ...req.params }, { abortEarly: false });

        const query = buildQuery(params);
        const projection = buildProjection(champs);

        const { find, pagination } = await findAndPaginate(dbCollection("organismes"), query, {
          page,
          limit: items_par_page,
          sort: { ["_meta.date_import"]: ordre === "asc" ? 1 : -1 },
          ...(isEmpty(projection) ? {} : { projection }),
        });

        let transformResponse;
        switch (ext) {
          case "xls":
            addCsvHeaders(`organismes-${DateTime.now().toISODate()}.csv`, "UTF-16", res);
            transformResponse = transformOrganisme.intoXls();
            break;
          case "csv":
            addCsvHeaders(`organismes-${DateTime.now().toISODate()}.csv`, "UTF-8", res);
            transformResponse = transformOrganisme.intoCsv();
            break;
          default:
            transformResponse = transformIntoJSON({
              arrayPropertyName: "organismes",
              arrayWrapper: {
                pagination,
              },
            });
        }

        sendJsonStream(
          oleoduc(
            find.stream(),
            transformData((data) => toDto(data)),
            transformResponse
          ),
          res
        );
      })
    );
  });

  router.get(
    "/api/v1/organismes/:siret",
    tryCatch(async (req, res) => {
      const { siret, champs } = await Joi.object({
        siret: Joi.string()
          .pattern(/^[0-9]{14}$/)
          .required(),
        champs: arrayOf().default([]),
      }).validateAsync({ ...req.params, ...req.query }, { abortEarly: false });

      const projection = buildProjection(champs);
      const organisme = await dbCollection("organismes").findOne({ siret }, { projection });

      if (!organisme) {
        throw Boom.notFound("Siret inconnu");
      }

      return res.json(toDto(organisme));
    })
  );

  router.put(
    "/api/v1/organismes/:siret/setUAI",
    rateLimiterMiddleware,
    verifyUser,
    canEditOrganisme(),
    tryCatch(async (req, res) => {
      const user = req.user;
      const auteur = `${user.type}-${user.code}`;
      const email = user.email;

      const { uai } = await Joi.object({
        uai: Joi.string()
          .pattern(/^[0-9]{7}[A-Z]{1}$/)
          .required(),
      }).validateAsync(req.body, { abortEarly: false });

      await addModification(auteur, email, req.organisme, { uai });

      const updated = await setUAI(req.organisme, uai, auteur);

      if (!updated) {
        throw Boom.notFound("Siret inconnu");
      }

      return res.json(toDto(updated));
    })
  );

  return router;
};
