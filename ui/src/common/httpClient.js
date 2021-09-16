import EventEmitter from "events";
import * as queryString from "querystring";

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

const emitter = new EventEmitter();

function handleResponse(path, response) {
  let statusCode = response.status;
  if (statusCode >= 400 && statusCode < 600) {
    emitter.emit("http:error", response);

    if (statusCode === 401 || statusCode === 403) {
      throw new AuthError(response.json(), statusCode);
    } else {
      throw new HTTPError(
        `Server returned ${statusCode} when requesting resource ${path}`,
        response.json(),
        statusCode
      );
    }
  }
  return response.json();
}

function getHeaders() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

export const _get = (path, parmeters = {}) => {
  let params = queryString.stringify(parmeters, { skipNull: true });

  return fetch(`${path}${params ? `?${params}` : ""}`, {
    method: "GET",
    headers: getHeaders(),
  }).then((res) => handleResponse(path, res));
};

export const _post = (path, body) => {
  return fetch(`${path}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  }).then((res) => handleResponse(path, res));
};

export const _put = (path, body = {}) => {
  return fetch(`${path}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(body),
  }).then((res) => handleResponse(path, res));
};

export const _delete = (path) => {
  return fetch(`${path}`, {
    method: "DELETE",
    headers: getHeaders(),
  }).then((res) => handleResponse(path, res));
};

export const subscribeToHttpEvent = (eventName, callback) => emitter.on(eventName, callback);
