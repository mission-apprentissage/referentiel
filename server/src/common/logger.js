const util = require("util");
const { throttle, omit, isEmpty } = require("lodash");
const bunyan = require("bunyan");
const BunyanSlack = require("bunyan-slack");
const config = require("../config");
const chalk = require("chalk");
const { compose, writeData, transformData } = require("oleoduc");

function prettyPrintStream(outputName) {
  const levels = {
    10: chalk.grey.bold("TRACE"),
    20: chalk.green.bold("DEBUG"),
    30: chalk.blue.bold("INFO"),
    40: chalk.yellow.bold("WARN"),
    50: chalk.red.bold("ERROR"),
    60: chalk.magenta.bold("FATAL"),
  };

  return compose(
    transformData((raw) => {
      const stack = raw.err?.stack;
      const message = stack ? `${raw.msg}\n${stack}` : raw.msg;
      const rest = omit(raw, [
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
        "err.name",
        "err.stack",
        "err.message",
        "err.code",
        "err.signal",
        //Misc
        "context",
      ]);

      const params = [
        util.format("[%s][%s][%s] %s", raw.time.toISOString()),
        levels[raw.level],
        raw.context || "global",
        message,
      ];
      if (!isEmpty(rest)) {
        params.push(chalk.gray(`\n${util.inspect(rest, { depth: null })}`));
      }
      return params;
    }),
    writeData((data) => console[outputName === "stdout" ? "log" : "error"](...data))
  );
}

function sendLogsToConsole(outputName) {
  const { level, format } = config.log;
  return format === "pretty"
    ? {
        type: "raw",
        name: outputName,
        level,
        stream: prettyPrintStream(outputName),
      }
    : {
        name: outputName,
        level,
        stream: process[outputName],
      };
}

function sendLogsToSlack() {
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
  const availableDestinations = {
    stdout: () => sendLogsToConsole("stdout"),
    stderr: () => sendLogsToConsole("stderr"),
    slack: () => sendLogsToSlack(),
  };

  return config.log.destinations
    .filter((type) => availableDestinations[type])
    .map((type) => {
      const createDestination = availableDestinations[type];
      return createDestination();
    });
};

module.exports = bunyan.createLogger({
  name: "referentiel",
  serializers: {
    ...bunyan.stdSerializers,
    err: function (err) {
      return {
        ...bunyan.stdSerializers.err(err),
        ...(err.errInfo ? { errInfo: err.errInfo } : {}),
      };
    },
  },
  streams: createStreams(),
});
