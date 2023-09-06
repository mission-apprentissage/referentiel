const crypto = require("crypto");

const comparePasswords = (inputPassword, storedSalt, storedHash) => {
  const iterations = 310000;
  const keyLength = 32;
  const hashAlgorithm = "sha256";

  try {
    const derivedKey = crypto.pbkdf2Sync(inputPassword, storedSalt, iterations, keyLength, hashAlgorithm);

    if (!derivedKey) {
      return false;
    }

    const derivedHash = derivedKey.toString("hex");

    if (derivedHash === storedHash) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error during password comparison:", error);
    return false;
  }
};

module.exports = {
  comparePasswords,
};
