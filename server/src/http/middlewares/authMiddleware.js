const config = require("../../config");
const passport = require("passport");
const { Strategy: AnonymousStrategy } = require("passport-anonymous");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { findRegionByCode } = require("../../common/regions");
const { findAcademieByCode } = require("../../common/academies");

passport.use(new AnonymousStrategy());
passport.use(
  "api-token",
  new JwtStrategy(
    {
      secretOrKey: config.auth.api.jwtSecret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter("token"),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      passReqToCallback: true,
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

module.exports = {
  checkApiToken,
  checkOptionnalApiToken,
};
