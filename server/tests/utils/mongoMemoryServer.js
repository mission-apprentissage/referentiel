let { MongoMemoryServer } = require("mongodb-memory-server");
const { connectToMongodb, getDatabase, prepareDatabase } = require("../../src/common/db/mongodb");

let mongodHolder;

module.exports = {
  async startMongod() {
    mongodHolder = await MongoMemoryServer.create();
    let uri = mongodHolder.getUri();
    let client = await connectToMongodb(uri);
    await prepareDatabase();
    return client;
  },
  stopMongod() {
    return mongodHolder.stop();
  },
  async dropDatabase() {
    return getDatabase().dropDatabase();
  },
};
