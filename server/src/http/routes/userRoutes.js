const express = require("express");
const jwt = require("jsonwebtoken");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { verifyUser } = require("../middlewares/authMiddleware");
const { buildJwtToken, buildRefreshToken } = require("../../common/utils/jwtUtils");
const { dbCollection } = require("../../common/db/mongodb");
const config = require("../../config");

const isDev = config.env === "local";

const { refreshTokenExpiry } = config.auth.api;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: !isDev,
  signed: true,
  maxAge: refreshTokenExpiry * 1000,
  sameSite: "strict",
};

module.exports = () => {
  const router = express.Router();

  router.post(
    "/api/v1/users/login/",
    verifyUser,
    tryCatch(async (req, res) => {
      const user = req.user;

      const token = buildJwtToken(user.email, user.type, user.code);
      const refreshToken = buildRefreshToken(user.email, user.type, user.code);

      const userRefreshTokens = user.refreshToken || [];
      userRefreshTokens.push(refreshToken);

      await dbCollection("users").updateOne({ email: user.email }, { $set: { refreshToken: userRefreshTokens } });

      res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
      res.json({ success: true, token });
    })
  );

  router.post(
    "/api/v1/users/refreshToken/",
    tryCatch(async (req, res) => {
      const { signedCookies = {} } = req;
      const { refreshToken } = signedCookies;

      if (!refreshToken) {
        res.status(401).json({ success: false, message: "Vous n'êtes pas autorisé." });
      }

      const payload = jwt.verify(refreshToken, config.auth.api.refreshTokenSecret);
      const userEmail = payload.email;

      const user = await dbCollection("users").findOne({ email: userEmail });

      const tokenIndex = user.refreshToken.findIndex((item) => item.refreshToken === refreshToken);
      const token = buildJwtToken(user.email, user.type, user.code);

      const newRefreshToken = buildRefreshToken(user.email, user.type, user.code);
      user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };

      await dbCollection("users").updateOne({ email: user.email }, { $set: { ...user } });

      res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
      res.status(200).json({ success: true, token });
    })
  );

  router.get(
    "/api/v1/users/logout/",
    tryCatch(async (req, res) => {
      const { signedCookies = {} } = req;
      const { refreshToken } = signedCookies;

      if (!refreshToken) {
        res.status(401).json({ success: false, message: "Vous n'êtes pas autorisé." });
      }

      const payload = jwt.verify(refreshToken, config.auth.api.refreshTokenSecret);
      const userEmail = payload.email;

      const user = await dbCollection("users").findOne({ email: userEmail });

      const tokenIndex = user.refreshToken.findIndex((item) => item.refreshToken === refreshToken);

      if (tokenIndex !== -1) {
        user.refreshToken.splice(tokenIndex, 1);
      }

      await dbCollection("users").updateOne({ email: user.email }, { $set: { ...user } });

      res.clearCookie("refreshToken", COOKIE_OPTIONS);
      res.status(200).json({ success: true });
    })
  );

  return router;
};
