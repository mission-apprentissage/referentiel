import { createContext, useState } from "react";
import jwt from "jsonwebtoken";
import queryString from "querystring";

const anonymous = { sub: "anonymous" };

export const ApiContext = createContext(getAuthFromStorage());

class AuthError extends Error {
  constructor(json, statusCode) {
    super(`Request rejected with status code ${statusCode}`);
    this.json = json;
    this.statusCode = statusCode;
    this.prettyMessage = "Identifiant ou mot de passe invalide";
  }
}

class HTTPError extends Error {
  constructor(message, json, statusCode) {
    super(message);
    this.json = json;
    this.statusCode = statusCode;
    this.prettyMessage = "Une erreur technique est survenue";
  }
}

function decodeJWT(token) {
  const decoded = jwt.decode(token);
  return { token, ...decoded };
}

function getAuthFromStorage() {
  const initial = sessionStorage.getItem("referentiel:token");
  return initial ? decodeJWT(initial) : anonymous;
}

export default function ApiProvider({ children }) {
  const [auth, setAuth] = useState(getAuthFromStorage());

  function logout() {
    sessionStorage.removeItem("referentiel:token");
    return setAuth(anonymous);
  }

  async function handleResponse(path, response) {
    const statusCode = response.status;
    const json = await response.json();
    if (statusCode >= 400 && statusCode < 600) {
      if (response.status === 401) {
        logout();
      } else if (statusCode === 403) {
        throw new AuthError(json, statusCode);
      } else {
        throw new HTTPError(`Server returned ${statusCode} when requesting resource ${path}`, json, statusCode);
      }
    }
    return json;
  }

  const getHeaders = (token) => {
    return {
      Accept: "application/json",
      ...(!token ? {} : { Authorization: `Bearer ${token}` }),
      "Content-Type": "application/json",
    };
  };

  const context = {
    auth,
    isAnonymous() {
      return auth.sub === anonymous.sub;
    },
    login(token) {
      sessionStorage.setItem("referentiel:token", token);
      return setAuth(decodeJWT(token));
    },
    logout,
    httpClient: {
      _get(path, parameters = {}, token = null) {
        const params = queryString.stringify(parameters, { skipNull: true });

        return fetch(`${path}${params ? `?${params}` : ""}`, {
          method: "GET",
          headers: getHeaders(token),
        }).then((res) => handleResponse(path, res));
      },
      _post(path, body) {
        return fetch(`${path}`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(body),
        }).then((res) => handleResponse(path, res));
      },
      _put(path, body = {}, token = null) {
        return fetch(`${path}`, {
          method: "PUT",
          headers: getHeaders(token),
          body: JSON.stringify(body),
        }).then((res) => handleResponse(path, res));
      },
      _delete(path) {
        return fetch(`${path}`, {
          method: "DELETE",
          headers: getHeaders(),
        }).then((res) => handleResponse(path, res));
      },
    },
  };

  return <ApiContext.Provider value={context}>{children}</ApiContext.Provider>;
}
