const util = require("util");
const { throttle, omit, isEmpty } = require("lodash");
const bunyan = require("bunyan");
const BunyanSlack = require("bunyan-slack");
const config = require("../config");
const chalk = require("chalk");
const { oleoduc, writeData, transformData } = require("oleoduc");

function prettyPrintStream(outputName) {
  let levels = {
    10: chalk.grey.bold("TRACE"),
    20: chalk.green.bold("DEBUG"),
    30: chalk.blue.bold("INFO"),
    40: chalk.yellow.bold("WARN"),
    50: chalk.red.bold("ERROR"),
    60: chalk.magenta.bold("FATAL"),
  };

  return oleoduc(
    transformData((raw) => {
      let stack = raw.err?.stack;
      let message = stack ? `${raw.msg}\n${stack}` : raw.msg;
      let rest = omit(raw, [
        //Bunyan core fields https://github.com/trentm/node-bunyan#core-fields
        "v",
        "level",
        "name",
        "hostname",
        "pid",
        "time",
        "msg",
        "src",
        //Error fields already serialized with https://github.com/trentm/node-bunyan#standard-serializers
        "err.stack",
        "err.message",
        "err.code",
        "err.signal",
      ]);

      let params = [util.format("[%s][%s] %s", raw.time.toISOString()), levels[raw.level], message];
      if (!isEmpty(rest)) {
        params.push(chalk.gray(`\n${util.inspect(rest, { depth: null })}`));
      }
      return params;
    }),
    writeData((data) => console[outputName === "stdout" ? "log" : "error"](...data)),
    { promisify: false }
  );
}

function consoleStream(outputName) {
  const { level, format } = config.log;
  return {
    type: "raw",
    name: outputName,
    level,
    stream: format === "pretty" ? prettyPrintStream(outputName) : process[outputName],
  };
}

function slackStream() {
  const stream = new BunyanSlack(
    {
      webhook_url: config.slackWebhookUrl,
      customFormatter: (record, levelName) => {
        if (record.type === "http") {
          record = {
            url: record.request.url.relative,
            statusCode: record.response.statusCode,
            ...(record.error ? { message: record.error.message } : {}),
          };
        }
        return {
          text: util.format(`[%s][${config.env}] %O`, levelName.toUpperCase(), record),
        };
      },
    },
    (error) => {
      console.error("Unable to send log to slack", error);
    }
  );

  stream.write = throttle(stream.write, 5000);

  return {
    name: "slack",
    level: "error",
    stream,
  };
}

const createStreams = () => {
  let availableDestinations = {
    stdout: () => consoleStream("stdout"),
    stderr: () => consoleStream("stderr"),
    slack: () => slackStream(),
  };

  return config.log.destinations.split(",").map((type) => availableDestinations[type]());
};

module.exports = bunyan.createLogger({
  name: "annuaire",
  serializers: bunyan.stdSerializers,
  streams: createStreams(),
});
