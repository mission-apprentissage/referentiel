const { MongoClient } = require("mongodb");
const config = require("../../config");
const collections = require("./collections");
const logger = require("../logger");

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

  return client;
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
  return collection.createIndexes(col);
}

async function configureValidation(collection) {
  ensureInitialization();
  logger.info(`Configuring validation for collection ${collection.name}...`);
  let db = getDatabase();
  return db.command({
    collMod: collection.name,
    validationLevel: "strict",
    validationAction: "error",
    validator: {
      $jsonSchema: collection.schema(),
    },
  });
}

async function createCollectionIfNeeded(name) {
  let db = getDatabase();
  let collections = await db.listCollections().toArray();
  if (!collections.find((c) => c.name === name)) {
    await db.createCollection(name);
  }
}

module.exports = {
  connectToMongodb,
  prepareDatabase: async (options) => {
    await Promise.all(
      Object.values(collections).map(async (col) => {
        await createCollectionIfNeeded(col.name);
        return Promise.all([configureIndexes(col, options), configureValidation(col, options)]);
      })
    );
  },
  getDatabase,
  dbCollection,
  closeMongodbConnection,
};
