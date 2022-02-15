import queryString from "querystring";
import useAuthContext from "./useAuthContext";
import { useMemo } from "react";

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

export default function useHttpClient() {
  let { auth, logout } = useAuthContext();

  return useMemo(() => {
    async function handleResponse(path, response) {
      let statusCode = response.status;
      let json = await response.json();
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

    const getHeaders = () => {
      return {
        Accept: "application/json",
        ...(auth.sub !== "anonymous" ? { Authorization: `Bearer ${auth.token}` } : {}),
        "Content-Type": "application/json",
      };
    };

    return {
      _get(path, parameters = {}) {
        let params = queryString.stringify(parameters, { skipNull: true });

        return fetch(`${path}${params ? `?${params}` : ""}`, {
          method: "GET",
          headers: getHeaders(),
        }).then((res) => handleResponse(path, res));
      },
      _post(path, body) {
        return fetch(`${path}`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(body),
        }).then((res) => handleResponse(path, res));
      },
      _put(path, body = {}) {
        return fetch(`${path}`, {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(body),
        }).then((res) => handleResponse(path, res));
      },
      _delete(path) {
        return fetch(`${path}`, {
          method: "DELETE",
          headers: getHeaders(),
        }).then((res) => handleResponse(path, res));
      },
    };
  }, [auth, logout]);
}
