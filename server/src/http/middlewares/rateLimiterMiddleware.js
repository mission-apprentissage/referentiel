const RateLimiter = require("../../common/apis/RateLimiter");
const config = require("../../config");

const loginRateLimiter = new RateLimiter("user", {
  nbRequests: config.env === "local" ? 100000 : 5,
  perSeconds: 60,
  maxQueueSize: 10,
});

const rateLimitMiddleware = async (req, res, next) => {
  try {
    await loginRateLimiter.execute(() => {});
    next();
  } catch (error) {
    res.status(429).json({ message: "Too many requests, please try again later." });
  }
};

module.exports = rateLimitMiddleware;
