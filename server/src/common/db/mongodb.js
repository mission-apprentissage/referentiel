const { MongoClient } = require("mongodb");
const config = require("../../config");
const schemas = require("./schemas");
const indexes = require("./indexes");

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

function getCollection(name) {
  ensureInitialization();
  return clientHolder.db().collection(name);
}

async function configureValidation(collectionName, getSchema) {
  ensureInitialization();
  let db = getDatabase();
  return db.command({
    collMod: collectionName,
    validationLevel: "strict",
    validationAction: "error",
    validator: {
      $jsonSchema: getSchema({ bson: true }),
    },
  });
}

async function configureIndexes(collectionName, getIndexes, options = {}) {
  ensureInitialization();
  let collection = getCollection(collectionName);
  if (options.dropIndexes) {
    await collection.dropIndexes();
  }
  return Promise.all(getIndexes(collection));
}

module.exports = {
  connectToMongodb,
  prepareDatabase: async (options) => {
    await Promise.all(
      Object.keys(indexes).map((key) => configureIndexes(key, indexes[key])),
      options
    );
    await Promise.all(
      Object.keys(schemas).map((key) => configureValidation(key.replace(/Schema/g, ""), schemas[key].acceSchema))
    );
  },
  getDatabase,
  getCollection,
  closeMongodbConnection,
};
