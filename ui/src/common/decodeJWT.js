const jwt = require("jsonwebtoken");

export default function decodeJWT(token) {
  let decoded = jwt.decode(token);
  return { token, ...decoded };
}
