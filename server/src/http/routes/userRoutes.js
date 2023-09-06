const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { verifyUser } = require("../middlewares/authMiddleware");
const { buildJwtToken, buildRefreshToken } = require("../../common/utils/jwtUtils");
const { dbCollection } = require("../../common/db/mongodb");

module.exports = () => {
  const router = express.Router();

  router.post(
    "/api/v1/users/login/",
    verifyUser,
    tryCatch(async (req, res) => {
      const user = req.user;

      const token = buildJwtToken(user.email, user.type, user.code);
      const refreshToken = buildRefreshToken(user);

      const userRefreshTokens = user.refreshToken || [];
      userRefreshTokens.push(refreshToken);

      await dbCollection("users").updateOne({ email: user.email }, { $set: { refreshToken: userRefreshTokens } });

      res.json({ success: true, token });
    })
  );

  return router;
};
