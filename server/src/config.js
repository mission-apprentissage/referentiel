const env = require("env-var");

module.exports = {
  env: env.get("REFERENTIEL_ENV").default("local").asString(),
  port: env.get("REFERENTIEL_PORT").default(5000).asPortNumber(),
  publicUrl: env.get("REFERENTIEL_PUBLIC_URL").default("http://localhost").asString(),
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
      uri: env.get("REFERENTIEL_OVH_STORAGE_URI").required().asString(),
      storageName: env.get("REFERENTIEL_OVH_STORAGE_NAME").default("mna-referentiel").asString(),
    },
  },
  sentry: {
    dsn: env.get("REFERENTIEL_SENTRY_DSN").asString(),
  },
  auth: {
    api: {
      jwtSecret: env.get("REFERENTIEL_AUTH_API_JWT_SECRET").default("abcdef").asString(),
      refreshTokenSecret: env.get("REFERENTIEL_AUTH_API_RT_SECRET").default("abcdef").asString(),
      refreshTokenExpiry: env.get("REFERENTIEL_AUTH_REFRESH_TOKEN_EXPIRY").default(2592000).asInt(),
      salt: env.get("REFERENTIEL_AUTH_API_SALT").default("abcdef").asString(),
      expiresIn: "1y",
    },
    cookieSecret: env.get("REFERENTIEL_AUTH_COOKIE_SECRET").default("abcdef").asString(),
  },
  sirene: {
    api: {
      consumerKey: env.get("REFERENTIEL_SIRENE_API_CONSUMER_KEY").required().asString(),
      consumerSecret: env.get("REFERENTIEL_SIRENE_API_CONSUMER_SECRET").required().asString(),
    },
  },
  api: {
    acce: {
      username: env.get("REFERENTIEL_API_ACCE_USERNAME").required().asString(),
      password: env.get("REFERENTIEL_API_ACCE_PASSWORD").required().asString(),
    },
    catalogue: {
      username: env.get("CATALOGUE_API_USERNAME").required().asString(),
      password: env.get("CATALOGUE_API_PASSWORD").required().asString(),
    },
    tableauDeBordApiKey: env.get("TABLEAU_DE_BORD_API_KEY").required().asString(),
    tableauDeBordApiUrl: env.get("TABLEAU_DE_BORD_PUBLIC_URL").required().asString(),
  },
};
