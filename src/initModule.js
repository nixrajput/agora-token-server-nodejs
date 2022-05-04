const router = require("./routes");

module.exports = (app) => {
  app.use("/api/v1", router);
  console.log("[module] loaded");
};
