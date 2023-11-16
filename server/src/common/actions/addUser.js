const crypto = require("crypto");
const { dbCollection } = require("../../common/db/mongodb");
const config = require("../../config");

const addUser = async (email, password, type, code) => {
  const salt = config.auth.api.salt;

  return crypto.pbkdf2(password, salt, 310000, 32, "sha256", async (err, encryptedPassword) => {
    if (err) {
      throw new Error("Error while deriving key");
    }
    const hashedPassword = encryptedPassword.toString("hex");

    return dbCollection("users").insertOne({
      email,
      hashedPassword,
      type,
      code,
    });
  });
};

module.exports = { addUser };
