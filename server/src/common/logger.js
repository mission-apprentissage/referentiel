const bunyan = require("bunyan");
const { oleoduc } = require("oleoduc");
const PrettyStream = require("bunyan-prettystream");

module.exports = bunyan.createLogger({
  name: "acce",
  serializers: bunyan.stdSerializers,
  streams: [
    {
      name: "console",
      level: process.env.LOG_LEVEL || "info",
      stream: oleoduc(new PrettyStream(), process.stderr, { promisify: false }),
    },
  ],
});
