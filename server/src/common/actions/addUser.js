const crypto = require("crypto");
const { promisify } = require("util");
const { dbCollection } = require("../../common/db/mongodb");
const config = require("../../config");
const { findRegionByCode } = require("../regions");
const { findAcademieByCode } = require("../academies");

const pbkdf2Async = promisify(crypto.pbkdf2);

const addUser = async (email, password, type, code) => {
  const jwtSecret = config.auth.api.jwtSecret;

  try {
    const hashedPasswordBuffer = await pbkdf2Async(password, jwtSecret, 310000, 32, "sha256");
    const hashedPassword = hashedPasswordBuffer.toString("hex");

    const found = type === "region" ? findRegionByCode(code) : findAcademieByCode(code);

    return dbCollection("users").insertOne({
      email,
      hashedPassword,
      type,
      code,
      nom: found?.nom || "",
    });
  } catch (err) {
    throw new Error("Error while deriving key");
  }
};

module.exports = { addUser };
