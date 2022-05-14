const MongodbCache = require("./MongodbCache");
const { DateTime } = require("luxon");

module.exports = {
  sireneApiCache: () =>
    new MongodbCache("sirene", {
      ttl: DateTime.now().plus({ month: 1 }).startOf("month").toJSDate(),
      cacheError: (apiError) => apiError.httpStatusCode <= 404,
    }),
  geoAdresseApiCache: () =>
    new MongodbCache("adresses", {
      ttl: DateTime.now().plus({ month: 1 }).toJSDate(),
      cacheError: (err) => {
        const apiError = err.cause;
        return apiError && apiError.httpStatusCode <= 400;
      },
    }),
};
