import { createContext } from "react";
import queryString from "querystring";

export const ApiContext = createContext({});

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

export default function ApiProvider({ children }) {
  async function handleResponse(path, response) {
    const statusCode = response.status;
    const json = await response.json();
    if (statusCode >= 400 && statusCode < 600) {
      if (statusCode === 403) {
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
