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
    expiresIn,
    subject,
  });
}

function buildJwtToken(email, type, code, isAdmin = false, options = {}) {
  const found = type === "region" ? findRegionByCode(code) : findAcademieByCode(code);
  return createToken("api", code, {
    payload: { email, code, type, nom: found.nom, isAdmin },
    ...options,
  });
}

function buildRefreshToken(email, type, code, isAdmin = false) {
  const refreshToken = jwt.sign({ email, type, code, isAdmin }, config.auth.api.refreshTokenSecret, {
    expiresIn: config.auth.api.refreshTokenExpiry,
  });
  return refreshToken;
}

module.exports = {
  buildJwtToken,
  buildRefreshToken,
};
