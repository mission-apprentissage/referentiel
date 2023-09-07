const passport = require("passport");
const { Strategy: AnonymousStrategy } = require("passport-anonymous");

const STRATEGIES = {
  local: "local",
  jwt: "jwt",
};

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

  const strategy = req.url === "/api/v1/users/login" ? STRATEGIES.local : STRATEGIES.jwt;
  return passport.authenticate(strategy, callback, { session: false })(req, res, next);
};

module.exports = {
  verifyUser,
  STRATEGIES,
  passportCallback,
};
