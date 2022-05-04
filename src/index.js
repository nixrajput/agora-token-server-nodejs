var http = require("http");
var express = require("express");
var {
  RtcTokenBuilder,
  RtmTokenBuilder,
  RtcRole,
  RtmRole,
} = require("agora-access-token");

var PORT = process.env.PORT || 8080;

if (!(process.env.APP_ID && process.env.APP_CERTIFICATE)) {
  throw new Error("You must define an APP_ID and APP_CERTIFICATE");
}
var appID = process.env.APP_ID;
var appCertificate = process.env.APP_CERTIFICATE;

const expirationTimeInSeconds = 3600; // 1 hour

var role = RtcRole.PUBLISHER;

var app = express();
app.disable("x-powered-by");
app.set("port", PORT);
app.use(express.favicon());
app.use(app.router);

var generateRtcToken = function (req, resp) {
  var currentTimestamp = Math.floor(Date.now() / 1000);
  var privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  var channelName = req.query.channelName;
  // use 0 if uid is not specified
  var uid = req.query.uid || 0;
  if (!channelName) {
    return resp.status(400).json({ error: "channel name is required" }).send();
  }

  var key = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  resp.header("Access-Control-Allow-Origin", "*");
  //resp.header("Access-Control-Allow-Origin", "http://ip:port")
  return resp.json({ key: key }).send();
};

var generateRtmToken = function (req, resp) {
  var currentTimestamp = Math.floor(Date.now() / 1000);
  var privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  var account = req.query.account;
  if (!account) {
    return resp.status(400).json({ error: "account is required" }).send();
  }

  var key = RtmTokenBuilder.buildToken(
    appID,
    appCertificate,
    account,
    RtmRole,
    privilegeExpiredTs
  );

  resp.header("Access-Control-Allow-Origin", "*");
  //resp.header("Access-Control-Allow-Origin", "http://ip:port")
  return resp.json({ key: key }).send();
};

app.get("/rtcToken", generateRtcToken);
app.get("/rtmToken", generateRtmToken);

http.createServer(app).listen(app.get("port"), function () {
  console.log("[server] starts at " + app.get("port"));
});
