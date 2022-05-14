const logger = require("../logger").child({ context: "cache" });
const { DateTime } = require("luxon");
const { dbCollection } = require("../db/mongodb");
const { serializeError, deserializeError } = require("serialize-error");

class MongodbCache {
  constructor(cacheName, options = {}) {
    this.cacheName = cacheName;
    this.options = options;
    this.collection = dbCollection("cache");
  }

  async get(key) {
    const res = await this.collection.findOne({ _id: `${this.cacheName}_${key}` });
    if (!res) {
      return null;
    }

    if (res.type === "error") {
      throw deserializeError(res.value);
    }

    logger.trace(`Value with key '${key}' retrieved from cache ${this.cacheName}`);
    return res.value;
  }

  async add(key, value) {
    logger.trace(`Adding key '${key}' to cache ${this.cacheName}...`);
    const isError = value instanceof Error;
    await this.collection.updateOne(
      {
        _id: `${this.cacheName}_${key}`,
        ...(isError ? { type: "error" } : {}),
      },
      {
        $set: {
          cacheName: this.cacheName,
          expires_at: this.options.ttl || DateTime.now().plus({ hour: 24 }).toJSDate(),
          value: isError ? serializeError(value) : value,
        },
      },
      { upsert: true }
    );
  }

  async memo(key, callback) {
    const found = await this.get(key);
    if (found) {
      return found;
    }

    return callback()
      .then(async (value) => {
        await this.add(key, value);
        return value;
      })
      .catch(async (err) => {
        const cacheError = this.options.cacheError;
        if (cacheError && cacheError(err)) {
          await this.add(key, err);
        }
        throw err;
      });
  }
}

module.exports = MongodbCache;
