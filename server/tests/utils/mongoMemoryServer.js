const { MongoMemoryServer } = require("mongodb-memory-server");
const { connectToMongodb, getDatabase, configureValidation, configureIndexes } = require("../../src/common/db/mongodb");

let mongodHolder;

module.exports = {
  async startMongod() {
    mongodHolder = await MongoMemoryServer.create({
      binary: {
        version: "5.0.2",
      },
    });
    const uri = mongodHolder.getUri();
    const client = await connectToMongodb(uri);
    await configureIndexes();
    await configureValidation();
    return client;
  },
  stopMongod() {
    return mongodHolder.stop();
  },
  async removeAll() {
    const collections = await getDatabase().collections();
    return Promise.all(collections.map((c) => c.deleteMany({})));
  },
};
