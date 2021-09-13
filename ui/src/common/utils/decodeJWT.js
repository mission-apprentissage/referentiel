const jwt = require("jsonwebtoken");

function decodeJWT(token) {
  return {
    token,
    ...jwt.decode(token),
  };
}

export default decodeJWT;
