const crypto = require("crypto");
const { dbCollection } = require("../../common/db/mongodb");
const config = require("../../config");

const addUser = (email, password, type, code) => {
  const salt = config.auth.api.salt;

  crypto.pbkdf2(password, salt, 310000, 32, "sha256", (err, encryptedPassword) => {
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
