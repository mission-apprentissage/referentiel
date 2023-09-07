const config = require("../../config");
const passport = require("passport");
const { Strategy: AnonymousStrategy } = require("passport-anonymous");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { findRegionByCode } = require("../../common/regions");
const { findAcademieByCode } = require("../../common/academies");

const STRATEGIES = {
  local: "local",
  jwt: "jwt",
};

passport.use(new AnonymousStrategy());
passport.use(
  "api-token",
  new JwtStrategy(
    {
      secretOrKey: config.auth.api.jwtSecret,
      ignoreExpiration: true,
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter("token"),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
    },
    (req, jwt_payload, done) => {
      const code = jwt_payload.sub;
      const type = jwt_payload.type;
      const found = type === "region" ? findRegionByCode(code) : findAcademieByCode(code);

      if (found) {
        const user = { type, code, departements: found.departements };
        done(null, user);
      } else {
        done(null, false);
      }
    }
  )
);

function checkOptionnalApiToken() {
  return passport.authenticate(["api-token", "anonymous"], {
    session: false,
    failWithError: true,
    assignProperty: "user",
  });
}

function checkApiToken() {
  return passport.authenticate("api-token", { session: false, failWithError: true, assignProperty: "user" });
}

const passportCallback = (req, res, next) => {
  return (error, user) => {
    if (error || !user) {
      res.status(401).json({ statusCode: 401, success: false, message: "Email ou mot de passe incorrect" });
    }
    req.user = user;
    next();
  };
};

const verifyUser = (req, res, next) => {
  const callback = passportCallback(req, res, next);

  const strategy = req.url === "/api/v1/users/login" ? STRATEGIES.local : STRATEGIES.jwt;
  return passport.authenticate(strategy, callback, { session: false })(req, res, next);
};

module.exports = {
  checkApiToken,
  checkOptionnalApiToken,
  verifyUser,
  STRATEGIES,
  passportCallback,
};
