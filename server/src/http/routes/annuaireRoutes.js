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

module.exports = () => {
  const router = express.Router();

  /**
   * @swagger
   *
   * /api/v1/etablissements:
   *   get:
   *     summary: Récupérer la liste des établissements
   *     parameters:
   *       - in: query
   *         name: siret
   *         description: Retourne uniquement l'établissement ayant ce siren/siret
   *         type: string
   *         required: false
   *       - in: query
   *         name: text
   *         description: Retourne uniquement l'établissement ayant cet uai.
   *         type: string
   *         required: false
   *       - in: query
   *         name: text
   *         description: Permet de faire une recherche sur tous les champs texte d'un établissement
   *         type: string
   *         required: false
   *       - in: query
   *         name: anomalies
   *         description: Si true renvoie uniquement les établissements contenant des anomalies
   *         type: string
   *         required: false
   *       - in: query
   *         name: page
   *         description: Le numéro de la page désirée
   *         type: string
   *         required: false
   *       - in: query
   *         name: items_par_page
   *         default: 10
   *         description: Le nombre maximum d'éléments dans la page
   *         type: string
   *       - in: query
   *         name: tri
   *         description: Le champ utilisé pour trier la liste des résultats
   *         type: string
   *       - in: query
   *         name: ordre
   *         description: L'ordre du tri
   *         default: desc
   *         type: string
   *         required: false
   *       - in: query
   *         name: champs
   *         description: |
   *          La liste des champs séparés par des virgules à inclure ou exclure dans la réponse.
   *          Exemple :
   *            - inclusion `champs=siret,uai`
   *            - exclusion `champs=-siret,uai`
   *         type: string
   *         required: false
   *     produces:
   *      - application/json
   *     tags:
   *       - Annuaire
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  etablissements:
   *                    type: array
   *                    items:
   *                      $ref: '#/components/schemas/annuaire'
   *                  pagination:
   *                    type: object
   *                    properties:
   *                      page:
   *                        type: string
   *                      resultats_par_page:
   *                        type: number
   *                      nombre_de_page:
   *                        type: number
   *                      total:
   *                        type: number
   */
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
              ...(uai ? { uai: uai } : {}),
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
              __v: 0,
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

  /**
   * @swagger
   *
   * /api/v1/etablissements/{siret}:
   *   get:
   *     summary: Récupérer les informations d'un établissement
   *     parameters:
   *       - in: path
   *         name: siret
   *         required: true
   *         schema:
   *          type: string
   *         example: "42476141900045"
   *       - in: query
   *         name: champs
   *         description: |
   *          La liste des champs séparés par des virgules à inclure ou exclure dans la réponse.
   *          Exemple :
   *            - Retourne uniquement les champs uai et siret `champs=siret,uai`
   *            - Retourne tous les champs sauf uai et siret `champs=-siret,uai`
   *         type: string
   *         required: false
   *     produces:
   *      - application/json
   *     tags:
   *       - Annuaire
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/annuaire'
   */
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
