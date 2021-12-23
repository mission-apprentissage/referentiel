import jwt from "jsonwebtoken";

function decodeJWT(token) {
  let decoded = jwt.decode(token);
  return { token, ...decoded };
}

const anonymous = { sub: "anonymous" };
let initial = sessionStorage.getItem("referentiel:token");
let auth = initial ? decodeJWT(initial) : anonymous;

export function getAuth() {
  return auth;
}

export function isAnonymous() {
  return auth.sub === anonymous.sub;
}

export function logout() {
  setAuth(anonymous);
}

export function setAuth(token) {
  if (token === anonymous) {
    auth = anonymous;
    sessionStorage.removeItem("referentiel:token");
  } else {
    auth = decodeJWT(token);
    sessionStorage.setItem("referentiel:token", token);
  }
}
