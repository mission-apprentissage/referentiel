const express = require("express");
const bodyParser = require("body-parser");
const logMiddleware = require("./middlewares/logMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");
const cors = require("cors");
const config = require("../config");

module.exports = async () => {
  const app = express();

  if (config.env === "local") {
    app.use(cors({ origin: "*" }));
  }
  app.use(bodyParser.json());
  app.use(logMiddleware());
  app.use(require("./routes/healthcheckRoutes")());
  app.use(require("./routes/organismesRoutes")());
  app.use(require("./routes/uaisRoutes")());
  app.use(require("./routes/datagouvRoutes")());
  app.use(require("./routes/dataRoutes")());
  app.use(require("./routes/statsRoutes")());
  app.use(require("./routes/swaggerRoutes")());

  app.use(errorMiddleware());
  app.use((req, res) => {
    res.status(404);
    res.json({});
  });

  return app;
};
