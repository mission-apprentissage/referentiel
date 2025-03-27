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
