const jwt = require("jsonwebtoken");
const config = require("../../config");
const { findRegionByCode } = require("../../common/regions");
const { findAcademieByCode } = require("../../common/academies");

function createToken(type, subject, options = {}) {
  const defaults = config.auth[type];
  const secret = options.secret || defaults.jwtSecret;
  const expiresIn = options.expiresIn || defaults.expiresIn;
  const payload = options.payload || {};

  return jwt.sign(payload, secret, {
    issuer: "referentiel",
    expiresIn: expiresIn,
    subject,
  });
}

function buildApiToken(type, code, options = {}) {
  const found = type === "region" ? findRegionByCode(code) : findAcademieByCode(code);
  return createToken("api", code, {
    payload: { code, type, nom: found.nom },
    ...options,
  });
}

module.exports = {
  buildApiToken,
};
