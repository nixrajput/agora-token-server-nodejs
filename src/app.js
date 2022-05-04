var express = require("express");

module.exports.runApp = () => {
  var app = express();

  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.disable("x-powered-by");

  // Index Route
  app.route("/").get(function (req, res) {
    res.status(200).json({
      success: true,
      message: "Server is up and running...",
    });
  });

  return app;
};

module.exports.closeApp = (app) => {
  app.use("*", (req, res, next) => {
    res.status(404).json({
      success: false,
      message: "API endpoint not found.",
    });
  });
};
