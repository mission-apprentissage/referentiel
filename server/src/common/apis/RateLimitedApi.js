const logger = require("../logger");
const RateLimiter = require("./RateLimiter");

class RateLimitedApi {
  constructor(name, client, options = {}) {
    this.name = name;
    this.rateLimiter = new RateLimiter(this.name, client, {
      nbRequests: options.nbRequests || 1,
      durationInSeconds: options.durationInSeconds || 1,
    });

    this.rateLimiter.on("status", ({ queueSize, maxQueueSize }) => {
      if (queueSize / maxQueueSize >= 0.8) {
        logger.warn(`${this.name} api queue is almost full : ${queueSize} / ${maxQueueSize}`);
      }
    });
  }

  execute(callback) {
    return this.rateLimiter.execute(callback);
  }
}

module.exports = RateLimitedApi;
