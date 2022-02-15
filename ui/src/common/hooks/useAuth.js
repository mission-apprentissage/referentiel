import { createContext, useState } from "react";
import jwt from "jsonwebtoken";

const anonymous = { sub: "anonymous" };

function decodeJWT(token) {
  let decoded = jwt.decode(token);
  return { token, ...decoded };
}

function getAuthFromStorage() {
  let initial = sessionStorage.getItem("referentiel:token");
  return initial ? decodeJWT(initial) : anonymous;
}

export function useAuth() {
  let [auth, setAuth] = useState(getAuthFromStorage());

  return {
    auth,
    isAnonymous() {
      return auth.sub === anonymous.sub;
    },
    login(token) {
      sessionStorage.setItem("referentiel:token", token);
      return setAuth(decodeJWT(token));
    },
    logout() {
      sessionStorage.removeItem("referentiel:token");
      return setAuth(anonymous);
    },
  };
}

export const AuthContext = createContext(anonymous);
