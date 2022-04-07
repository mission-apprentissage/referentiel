const { mergeStreams, oleoduc, writeData } = require("oleoduc");
const { uniq, isEmpty } = require("lodash");
const { flattenObject, isError, omitNil } = require("../common/utils/objectUtils");
const { isUAIValid } = require("../common/utils/uaiUtils");
const logger = require("../common/logger").child({ context: "collect" });
const { dbCollection } = require("../common/db/mongodb");
const { sortBy } = require("lodash/collection");
const createDatagouvSource = require("./sources/datagouv");

function buildQuery(selector) {
  if (isEmpty(selector)) {
    return { siret: "not matching" };
  }

  return typeof selector === "object" ? selector : { $or: [{ siret: selector }, { uai: selector }] };
}

function mergeArray(source, existingArray, discriminator, newArray, options = {}) {
  let updated = newArray.map((element) => {
    let previous = existingArray.find((e) => e[discriminator] === element[discriminator]) || {};
    return {
      ...previous,
      ...element,
      sources: uniq([...(previous.sources || []), source]),
      ...(options.merge ? options.merge(previous, element) : {}),
    };
  });

  let untouched = existingArray.filter((p) => {
    return !updated.map((u) => u[discriminator]).includes(p[discriminator]);
  });

  return sortBy([...updated, ...untouched], discriminator);
}

function mergeUAIPotentiels(source, potentiels, newPotentiels) {
  return mergeArray(
    source,
    potentiels,
    "uai",
    newPotentiels
      .filter((uai) => isUAIValid(uai))
      .map((uai) => ({
        uai,
      }))
  );
}

async function mergeRelations(source, relations, newRelations, siretsFromDatagouv) {
  let validatedNewRelations = await newRelations.reduce(async (acc, relation) => {
    let isInReferentiel = (await dbCollection("organismes").countDocuments({ siret: relation.siret })) > 0;
    let isInDatagouv = siretsFromDatagouv.includes(relation.siret);

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

  return mergeArray(source, relations, "siret", validatedNewRelations, {
    merge: (previous, relation) => {
      let availables = uniq([relation.type, previous.type]);
      return {
        type: availables.find((v) => v?.indexOf("->") !== -1) || availables[0],
      };
    },
  });
}

function mergeContacts(source, contacts, newContacts) {
  return mergeArray(
    source,
    contacts,
    "email",
    newContacts.map((contact) => {
      return {
        ...contact,
        confirmé: contact.confirmé || false,
      };
    })
  );
}

function mergeNature(current, newNature) {
  if (
    (current === "responsable" && newNature === "formateur") ||
    (current === "formateur" && newNature === "responsable")
  ) {
    return "responsable_formateur";
  }

  return newNature || current;
}

function handleAnomalies(source, organisme, newAnomalies) {
  logger.warn({ anomalies: newAnomalies }, `Erreur lors de la collecte pour l'organisme ${organisme.siret}.`, {
    source,
  });

  return dbCollection("organismes").updateOne(
    { siret: organisme.siret },
    {
      $set: {
        "_meta.anomalies": mergeArray(
          source,
          organisme._meta.anomalies,
          "key",
          newAnomalies.map((ano) => {
            let error = isError(ano) && ano;
            return {
              key: error ? `${error.httpStatusCode || error.message}` : ano.key,
              type: error ? "erreur" : ano.type,
              details: error ? error.message : ano.details,
              job: "collect",
              date: new Date(),
            };
          })
        ),
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
  let sources = Array.isArray(array) ? array : [array];
  let filters = options.filters || {};
  let stats = createStats(sources);
  let streams = await getStreams(sources, filters);
  let datagouv = createDatagouvSource();
  let siretsFromDatagouv = await datagouv.loadSirets();

  await oleoduc(
    mergeStreams(streams),
    writeData(async (res) => {
      let {
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
      } = res;

      if (filters.siret && filters.siret !== selector) {
        return;
      }

      stats[from].total++;
      let query = buildQuery(selector);
      let cursor = dbCollection("organismes").find(query);

      if ((await cursor.count()) === 0) {
        logger.trace(`Organisme ${JSON.stringify(query)} inconnu`, { source: from });
        stats[from].unknown++;
        return;
      }

      for await (const organisme of cursor.stream()) {
        try {
          if (anomalies.length > 0) {
            stats[from].anomalies++;
            await handleAnomalies(from, organisme, anomalies);
          }

          let res = await dbCollection("organismes").updateOne(
            { siret: organisme.siret },
            {
              $set: omitNil({
                ...flattenObject(data),
                nature: mergeNature(organisme.nature, nature),
                uai_potentiels: mergeUAIPotentiels(from, organisme.uai_potentiels, uai_potentiels),
                relations: await mergeRelations(from, organisme.relations, relations, siretsFromDatagouv),
                contacts: mergeContacts(from, organisme.contacts, contacts),
                diplomes: mergeArray(from, organisme.diplomes, "code", diplomes),
                certifications: mergeArray(from, organisme.certifications, "code", certifications),
                lieux_de_formation: mergeArray(from, organisme.lieux_de_formation, "code", lieux_de_formation),
              }),
              $addToSet: {
                reseaux: {
                  $each: reseaux,
                },
              },
            }
          );

          let nbModifiedDocuments = res.modifiedCount;
          if (nbModifiedDocuments) {
            stats[from].updated += nbModifiedDocuments;
            logger.debug(`Organisme ${organisme.siret} mis à jour`, { source: from });
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
