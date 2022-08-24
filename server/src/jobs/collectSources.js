const { mergeStreams, oleoduc, writeData } = require("oleoduc");
const { uniq, isEmpty } = require("lodash");
const { flattenObject, isError, omitNil } = require("../common/utils/objectUtils");
const { isUAIValid } = require("../common/utils/validationUtils");
const logger = require("../common/logger").child({ context: "collect" });
const { dbCollection } = require("../common/db/mongodb");
const { sortBy } = require("lodash/collection");
const createDatagouvSource = require("./sources/datagouv");
const getAllSirets = require("../common/actions/getAllSirets.js");
const { promiseAllProps } = require("../common/utils/asyncUtils.js");

function buildQuery(selector) {
  if (isEmpty(selector)) {
    return { siret: "not matching" };
  }

  return typeof selector === "object" ? selector : { $or: [{ siret: selector }, { uai: selector }] };
}

function mergeArray(source, existingArray, newArray, discriminator, options = {}) {
  const updated = newArray.map((element) => {
    const previous = existingArray.find((e) => e[discriminator] === element[discriminator]) || {};
    return {
      ...previous,
      ...element,
      sources: uniq([...(previous.sources || []), source]),
      ...(options.merge ? options.merge(previous, element) : {}),
    };
  });

  const untouched = existingArray.filter((p) => {
    return !updated.map((u) => u[discriminator]).includes(p[discriminator]);
  });

  return sortBy([...updated, ...untouched], discriminator);
}

function mergeUAIPotentiels(source, potentiels, newPotentiels) {
  let newArray = newPotentiels
    .filter((uai) => isUAIValid(uai))
    .map((uai) => ({
      uai,
    }));

  return mergeArray(source, potentiels, newArray, "uai");
}

async function mergeRelations(source, relations, newRelations, sirets) {
  const validatedNewRelations = await newRelations.reduce(async (acc, relation) => {
    const isInReferentiel = sirets.referentiel.includes(relation.siret);
    const isInDatagouv = sirets.datagouv.includes(relation.siret);

    if (!isInReferentiel && !isInDatagouv) {
      return Promise.resolve(acc);
    }

    return Promise.resolve([
      ...(await acc),
      {
        ...relation,
        referentiel: isInReferentiel,
      },
    ]);
  }, Promise.resolve([]));

  return mergeArray(source, relations, validatedNewRelations, "siret", {
    merge: (previous, relation) => {
      const availables = uniq([relation.type, previous.type]);
      return {
        type: availables.find((v) => v?.indexOf("->") !== -1) || availables[0],
      };
    },
  });
}

function mergeContacts(source, contacts, newContacts) {
  let newArray = newContacts.map((contact) => {
    return {
      ...contact,
      confirmé: contact.confirmé || false,
    };
  });

  return mergeArray(source, contacts, newArray, "email");
}

function mergeNature(current, newNature) {
  const all = [current, newNature];
  if ((all.includes("responsable") && all.includes("formateur")) || all.includes("responsable_formateur")) {
    return "responsable_formateur";
  }

  return newNature || current;
}

function handleAnomalies(source, organisme, newAnomalies) {
  logger.warn({ anomalies: newAnomalies }, `Erreur lors de la collecte pour l'organisme ${organisme.siret}.`, {
    source,
  });

  let newArray = newAnomalies.map((ano) => {
    const error = isError(ano) && ano;
    return {
      key: error ? `${error.httpStatusCode || error.message}` : ano.key,
      type: error ? "erreur" : ano.type,
      details: error ? error.message : ano.details,
      job: "collect",
      date: new Date(),
    };
  });

  return dbCollection("organismes").updateOne(
    { siret: organisme.siret },
    {
      $set: {
        "_meta.anomalies": mergeArray(source, organisme._meta.anomalies, newArray, "key"),
      },
    },
    { runValidators: true }
  );
}

function createStats(sources) {
  return sources.reduce((acc, source) => {
    return {
      ...acc,
      [source.name]: {
        total: 0,
        updated: 0,
        unknown: 0,
        failed: 0,
        anomalies: 0,
      },
    };
  }, {});
}

async function getStreams(sources, filters) {
  return Promise.all(
    sources.map((source) => {
      logger.info(`Collecte de la sources de données : ${source.name}...`);
      return source.stream({ filters });
    })
  );
}

module.exports = async (array, options = {}) => {
  const sources = Array.isArray(array) ? array : [array];
  const filters = options.filters || {};
  const stats = createStats(sources);
  const streams = await getStreams(sources, filters);
  const datagouv = createDatagouvSource();
  const sirets = await promiseAllProps({ referentiel: getAllSirets(), datagouv: datagouv.loadSirets() });

  await oleoduc(
    mergeStreams(streams),
    writeData(async (fragment) => {
      const {
        from,
        selector,
        uai_potentiels = [],
        contacts = [],
        relations = [],
        reseaux = [],
        diplomes = [],
        certifications = [],
        lieux_de_formation = [],
        nature,
        data = {},
        anomalies = [],
      } = fragment;

      if (filters.siret && filters.siret !== selector) {
        return;
      }

      stats[from].total++;
      const query = buildQuery(selector);
      const count = selector ? await dbCollection("organismes").countDocuments(query) : 0;

      if (count === 0) {
        logger.trace(`Organisme ${JSON.stringify(query)} inconnu`, { source: from });
        stats[from].unknown++;
        return;
      }

      for await (const organisme of dbCollection("organismes").find(query).stream()) {
        try {
          if (anomalies.length > 0) {
            stats[from].anomalies++;
            await handleAnomalies(from, organisme, anomalies);
          }

          const res = await dbCollection("organismes").updateOne(
            { siret: organisme.siret },
            {
              $set: omitNil({
                ...flattenObject(data),
                nature: mergeNature(organisme.nature, nature),
                uai_potentiels: mergeUAIPotentiels(from, organisme.uai_potentiels, uai_potentiels),
                relations: await mergeRelations(from, organisme.relations, relations, sirets),
                contacts: mergeContacts(from, organisme.contacts, contacts),
                diplomes: mergeArray(from, organisme.diplomes, diplomes, "code"),
                certifications: mergeArray(from, organisme.certifications, certifications, "code"),
                lieux_de_formation: mergeArray(from, organisme.lieux_de_formation, lieux_de_formation, "code"),
              }),
              $addToSet: {
                reseaux: {
                  $each: reseaux,
                },
              },
            }
          );

          const nbModifiedDocuments = res.modifiedCount;
          if (nbModifiedDocuments) {
            stats[from].updated += nbModifiedDocuments;
            logger.debug(`Organisme ${organisme.siret} mis à jour`, { source: from });
          } else {
            logger.trace(`Organisme ${organisme.siret} déjà à jour`, { source: from });
          }
        } catch (e) {
          stats[from].failed++;
          await handleAnomalies(from, organisme, [e]);
        }
      }
    })
  );

  return stats;
};
