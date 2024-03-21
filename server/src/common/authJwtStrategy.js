const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const config = require("../config");
const { dbCollection } = require("./db/mongodb");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.auth.api.jwtSecret,
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    const user = await dbCollection("users").findOne({ email: jwt_payload.email });

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  })
);
