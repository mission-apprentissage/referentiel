const env = require("env-var");

module.exports = {
  env: env.get("REFERENTIEL_ENV").default("local").asString(),
  log: {
    level: env.get("REFERENTIEL_LOG_LEVEL").default("info").asString(),
    format: env.get("REFERENTIEL_LOG_FORMAT").default("pretty").asString(),
    destinations: env.get("REFERENTIEL_LOG_DESTINATIONS").default("stdout").asArray(),
  },
  slackWebhookUrl: env.get("REFERENTIEL_SLACK_WEBHOOK_URL").asString(),
  mongodb: {
    uri: env
      .get("REFERENTIEL_MONGODB_URI")
      .default("mongodb://127.0.0.1:27017/referentiel?retryWrites=true&w=majority")
      .asString(),
  },
  ovh: {
    storage: {
      uri: env.get("REFERENTIEL_OVH_STORAGE_URI").asString(),
    },
  },
  sentry: {
    dsn: env.get("REFERENTIEL_SENTRY_DSN").asString(),
  },
};
