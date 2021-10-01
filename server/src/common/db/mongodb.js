const { MongoClient } = require("mongodb");
const config = require("../../config");
const collections = require("./collections");
const logger = require("../logger");
const { writeData } = require("oleoduc");

let clientHolder;

function ensureInitialization() {
  if (!clientHolder) {
    throw new Error("Database connection does not exist. Please call connectToMongodb before.");
  }
}

async function connectToMongodb(uri = config.mongodb.uri) {
  let client = await new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  clientHolder = client;

  if (config.log.destinations.includes("mongodb")) {
    storeLogsIntoMongodb();
  }

  return client;
}

function storeLogsIntoMongodb() {
  logger.addStream({
    name: "mongodb",
    type: "raw",
    level: "info",
    stream: writeData((data) => dbCollection("logs").insertOne(data)),
  });
}

function closeMongodbConnection() {
  ensureInitialization();
  return clientHolder.close();
}

function getDatabase() {
  ensureInitialization();
  return clientHolder.db();
}

function dbCollection(name) {
  ensureInitialization();
  return clientHolder.db().collection(name);
}

async function configureIndexes(collection, options = {}) {
  ensureInitialization();
  let shouldDropIndexes = options.dropIndexes || false;

  if (!collection.createIndexes) {
    return;
  }

  logger.info(`Configuring indexes for collection ${collection.name} (drop:${shouldDropIndexes})...`);
  let col = dbCollection(collection.name);
  if (shouldDropIndexes) {
    await col.dropIndexes();
  }
  await collection.createIndexes(col);
}

async function configureValidation(collection) {
  ensureInitialization();
  if (!collection.schema) {
    return;
  }

  logger.info(`Configuring validation for collection ${collection.name}...`);
  let db = getDatabase();

  await db.command({
    collMod: collection.name,
    validationLevel: "strict",
    validationAction: "error",
    validator: {
      $jsonSchema: collection.schema(),
    },
  });
}

async function createCollectionIfNeeded(collection) {
  let db = getDatabase();
  let collections = await db.listCollections().toArray();

  if (!collections.find((c) => c.name === collection.name)) {
    await db.createCollection(collection.name).catch(() => {});
  }
}

function clearCollection(name) {
  logger.warn(`Suppresion des données de la collection ${name}...`);
  return dbCollection(name)
    .deleteMany({})
    .then((res) => res.deletedCount);
}

module.exports = {
  connectToMongodb,
  prepareDatabase: async (options) => {
    await Promise.all(
      Object.values(collections).map(async (col) => {
        //Force collection creation
        await createCollectionIfNeeded(col);
        await configureIndexes(col, options);
        await configureValidation(col, options);
      })
    );
  },
  getDatabase,
  dbCollection,
  closeMongodbConnection,
  clearCollection,
};
