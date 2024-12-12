const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { dbCollection } = require("./db/mongodb");
const { comparePasswords } = require("./utils/userUtils");
const config = require("../config");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      const salt = config.auth.api.jwtSecret;
      const user = await dbCollection("users").findOne({ email: email?.toLowerCase().trim() });

      if (!user) {
        return done(null, false, { message: "Incorrect username or password" });
      }

      const isMatchingPassword = comparePasswords(password, salt, user.hashedPassword);

      if (!isMatchingPassword) {
        return done(null, false, { message: "Incorrect username or password" });
      }

      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
