const logger = require("../logger");

class InMemoryCache {
  constructor(cacheName) {
    this.name = cacheName;
    this.cache = {};
  }

  get(key) {
    let value = this.cache[key];
    if (value) {
      logger.trace(`Value with key '${key}' retrieved from cache ${this.name}`);
    }
    return value;
  }

  add(key, value) {
    logger.trace(`Key '${key}' added to cache ${this.name}`);
    this.cache[key] = value;
  }

  async memo(key, callback) {
    let value = this.get(key);
    if (!value) {
      value = await callback();
      this.add(key, value);
    }
    return value;
  }

  flush() {
    logger.trace(`Cache '${this.name} ' flushed`);
    this.cache = {};
  }
}

module.exports = InMemoryCache;
