const _ = require("lodash");
const logger = require("../../common/logger");

module.exports = () => {
  return (req, res, next) => {
    let relativeUrl = (req.baseUrl || "") + (req.url || "");
    let startTime = new Date().getTime();
    let withoutSensibleFields = (obj) => {
      return _.omitBy(obj, (value, key) => {
        let lower = key.toLowerCase();
        return lower.indexOf("token") !== -1 || ["authorization", "password", "newPassword"].includes(lower);
      });
    };

    let log = () => {
      try {
        let error = req.err;
        let statusCode = res.statusCode;
        let data = {
          type: "http",
          elapsedTime: new Date().getTime() - startTime,
          request: {
            method: req.method,
            headers: {
              ...withoutSensibleFields(req.headers),
            },
            url: {
              relative: relativeUrl,
              path: (req.baseUrl || "") + (req.path || ""),
              parameters: withoutSensibleFields(req.query),
            },
            body: withoutSensibleFields(req.body),
          },
          response: {
            statusCode,
            headers: res.getHeaders(),
          },
          ...(error
            ? {
                error: {
                  ...error,
                  message: req.errorMessage || error.message,
                  stack: error.stack,
                },
              }
            : {}),
        };

        let level = error || (statusCode >= 400 && statusCode < 600) ? "error" : "info";

        logger[level](data, `Http Request ${level === "error" ? "KO" : "OK"}`);
      } finally {
        res.removeListener("finish", log);
        res.removeListener("close", log);
      }
    };

    res.on("close", log);
    res.on("finish", log);

    next();
  };
};
