const logger = require("../logger").child({ context: "api" });
const RateLimiter = require("./RateLimiter");
const ApiError = require("./ApiError");

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

  async execute(callback) {
    try {
      return await this.rateLimiter.execute(callback);
    } catch (e) {
      throw new ApiError(this.name, e.message, e.code || e.response?.status);
    }
  }
}

module.exports = RateLimitedApi;
