const logger = require("../common/logger");
const { closeMongodbConnection, connectToMongodb, prepareDatabase } = require("../common/db/mongodb");
const ms = require("ms");

process.on("unhandledRejection", (e) => console.error(e));
process.on("uncaughtException", (e) => console.error(e));

const createTimer = () => {
  let launchTime;
  return {
    start: () => {
      launchTime = new Date().getTime();
    },
    stop: (results) => {
      const duration = ms(new Date().getTime() - launchTime);
      const data = results && results.toJSON ? results.toJSON() : results;
      logger.info(JSON.stringify(data || {}, null, 2));
      logger.info(`Completed in ${duration}`);
    },
  };
};

const exit = async (rawError) => {
  let error = rawError;
  if (rawError) {
    logger.error(rawError.constructor.name === "EnvVarError" ? rawError.message : rawError);
  }

  setTimeout(() => {
    //Waiting logger to flush all logs (MongoDB)
    closeMongodbConnection()
      .then(() => {})
      .catch((closeError) => {
        error = closeError;
        console.error(error);
      });
  }, 250);

  process.exitCode = error ? 1 : 0;
};

async function runScript(job) {
  try {
    const timer = createTimer();
    timer.start();

    await connectToMongodb();
    await prepareDatabase();

    const results = await job();

    timer.stop(results);
    await exit();
  } catch (e) {
    await exit(e);
  }
}

module.exports = runScript;
