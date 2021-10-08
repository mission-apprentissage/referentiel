class ApiError extends Error {
  constructor(apiName, message, httpStatusCode) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.apiName = apiName;
    this.message = `[${apiName}] ${message}`;
    this.httpStatusCode = httpStatusCode;
  }
}

module.exports = ApiError;
