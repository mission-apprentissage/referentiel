const crypto = require("crypto");
const { dbCollection } = require("../../common/db/mongodb");
const config = require("../../config");
const { findRegionByCode } = require("../regions");
const { findAcademieByCode } = require("../academies");

const addUser = async (email, password, type, code) => {
  const jwtSecret = config.auth.api.jwtSecret;

  return crypto.pbkdf2(password, jwtSecret, 310000, 32, "sha256", async (err, encryptedPassword) => {
    if (err) {
      throw new Error("Error while deriving key");
    }
    const hashedPassword = encryptedPassword.toString("hex");

    const found = type === "region" ? findRegionByCode(code) : findAcademieByCode(code);

    return dbCollection("users").insertOne({
      email,
      hashedPassword,
      type,
      code,
      nom: found?.nom || "",
    });
  });
};

module.exports = { addUser };
