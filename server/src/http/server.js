const express = require("express");
const bodyParser = require("body-parser");
const logMiddleware = require("./middlewares/logMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");

module.exports = async (components) => {
  const app = express();

  app.use(bodyParser.json());
  app.use(logMiddleware());
  app.use(require("./routes/healthcheckRoutes")(components));

  app.use(errorMiddleware());
  app.use((req, res) => {
    res.status(404);
    res.json({});
  });

  return app;
};
