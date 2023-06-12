const env = require("env-var");

module.exports = {
  apiUrl: env.get("REACT_APP_REFERENTIEL_API_URL").default("http://localhost:5001/api/v1").asString(),
};
