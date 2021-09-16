const env = require("env-var");

module.exports = {
  log: {
    level: env.get("ANNUAIRE_LOG_LEVEL").default("info").asString(),
    format: env.get("ANNUAIRE_LOG_FORMAT").default("pretty").asString(),
    destinations: env.get("ANNUAIRE_LOG_DESTINATIONS").default("stdout").asString(),
  },
  mongodb: {
    uri: env
      .get("ANNUAIRE_MONGODB_URI")
      .default("mongodb://127.0.0.1:27017/annuaire?retryWrites=true&w=majority")
      .asString(),
  },
  ovh: {
    storage: {
      uri: env.get("ANNUAIRE_OVH_STORAGE_URI").asString(),
    },
  },
  sentry: {
    dsn: env.get("ANNUAIRE_SENTRY_DSN").asString(),
  },
};
