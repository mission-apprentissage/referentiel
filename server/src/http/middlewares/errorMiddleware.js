const Boom = require("boom");
const createSentry = require("./sentry");

function boomify(rawError) {
  let error;
  if (rawError.isBoom) {
    error = rawError;
  } else if (rawError.name === "ValidationError") {
    //This is a joi validation error
    error = Boom.badRequest("Erreur de validation");
    error.output.payload.details = rawError.details;
  } else {
    error = Boom.boomify(rawError, {
      statusCode: rawError.status || 500,
      ...(!rawError.message ? "Une erreur est survenue" : {}),
    });
  }
  return error;
}

module.exports = () => {
  const sentry = createSentry();

  // eslint-disable-next-line no-unused-vars
  return (rawError, req, res, next) => {
    sentry.sendError(rawError);

    req.err = rawError;

    const { output } = boomify(req.err);
    return res.status(output.statusCode).send(output.payload);
  };
};
