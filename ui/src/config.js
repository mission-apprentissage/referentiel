const env = require("env-var");

module.exports = {
  apiUrl: env.get("REACT_APP_REFERENTIEL_API_URL").default("/api/v1").asString(),
};
