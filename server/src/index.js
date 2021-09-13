const server = require("./http/server");
const logger = require("./common/logger");

process.on("unhandledRejection", (e) => logger.error("An unexpected error occurred", e));
process.on("uncaughtException", (e) => logger.error("An unexpected error occurred", e));

(async function () {
  const http = await server();
  http.listen(5000, () => logger.info(`Server ready and listening on port ${5000}`));
})();
