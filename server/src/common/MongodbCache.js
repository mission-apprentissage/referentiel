const logger = require("./logger");
const { DateTime } = require("luxon");
const { dbCollection } = require("./db/mongodb");

class MongodbCache {
  constructor(cacheName, options = {}) {
    this.cacheName = cacheName;
    this.options = options;
    this.collection = dbCollection("cache");
  }

  async get(key) {
    let res = await this.collection.findOne({ _id: `${this.cacheName}_${key}` });
    if (!res) {
      return null;
    }

    logger.debug(`Value with key '${key}' retrieved from cache ${this.cacheName}`);
    return res.value;
  }

  async add(key, value) {
    logger.debug(`Adding key '${key}' to cache ${this.cacheName}...`);
    await this.collection.updateOne(
      {
        _id: `${this.cacheName}_${key}`,
      },
      {
        $set: {
          cacheName: this.cacheName,
          expires_at: this.options.ttl || DateTime.now().plus({ hour: 24 }).toJSDate(),
          value,
        },
      },
      { upsert: true }
    );
  }

  async memo(key, callback) {
    let value = await this.get(key);
    if (!value) {
      value = await callback();
      await this.add(key, value);
    }
    return value;
  }
}

module.exports = MongodbCache;
