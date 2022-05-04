var dotenv = require("dotenv");
const { runApp, closeApp } = require("./app");
const initModule = require("./initModule");

const app = runApp();

(async () => {
  // Config
  if (process.env.NODE_ENV !== "production") {
    dotenv.config({
      path: "src/.env",
    });
  }

  if (!(process.env.APP_ID && process.env.APP_CERTIFICATE)) {
    throw new Error("You must define an APP_ID and APP_CERTIFICATE");
  }

  initModule(app);

  closeApp(app);

  var port = process.env.PORT || 8080;

  const server = app.listen(port, (err) => {
    if (err) {
      console.log(`[server] could not start http server on port: ${port}`);
      return;
    }
    console.log(`[server] running on port: ${port}`);
  });

  // Handling Uncaught Exception
  process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`[server] shutting down due to Uncaught Exception`);

    server.close(() => {
      process.exit(1);
    });
  });

  // Unhandled Promise Rejection
  process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`[server] shutting down due to Unhandled Promise Rejection`);

    server.close(() => {
      process.exit(1);
    });
  });
})();
