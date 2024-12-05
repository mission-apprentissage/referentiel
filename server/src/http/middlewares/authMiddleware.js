const passport = require("passport");
const { Strategy: AnonymousStrategy } = require("passport-anonymous");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { findRegionByCode } = require("../../common/regions");
const { findAcademieByCode } = require("../../common/academies");
const config = require("../../config");

const STRATEGIES = {
  local: "local",
  jwt: "jwt",
  apiToken: "api-token",
};

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
      const email = jwt_payload.email;
      const isAdmin = jwt_payload.isAdmin;

      const found = type === "region" ? findRegionByCode(code) : findAcademieByCode(code);

      if (found) {
        const user = { type, code, email, isAdmin, departements: found.departements };
        done(null, user);
      } else {
        done(null, false);
      }
    }
  )
);

passport.use(new AnonymousStrategy());

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
  const signedCookie = req.signedCookies?.refreshToken;
  const strategy =
    req.url === "/api/v1/users/login" ? STRATEGIES.local : signedCookie ? STRATEGIES.jwt : STRATEGIES.apiToken;
  return passport.authenticate(strategy, callback, { session: false })(req, res, next);
};

const isUserAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    res.status(401).json({ statusCode: 401, success: false, message: "Vous n'êtes pas autorisé" });
  }
  next();
};

module.exports = {
  verifyUser,
  STRATEGIES,
  passportCallback,
  isUserAdmin,
};
