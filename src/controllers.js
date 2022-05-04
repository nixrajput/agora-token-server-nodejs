var {
  RtcTokenBuilder,
  RtmTokenBuilder,
  RtcRole,
  RtmRole,
} = require("agora-access-token");

module.exports.generateRtcToken = function (req, resp) {
  var appID = process.env.APP_ID;
  var appCertificate = process.env.APP_CERTIFICATE;

  const expirationTimeInSeconds = 3600; // 1 hour

  var role = RtcRole.PUBLISHER;

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

module.exports.generateRtmToken = function (req, resp) {
  var appID = process.env.APP_ID;
  var appCertificate = process.env.APP_CERTIFICATE;

  const expirationTimeInSeconds = 3600; // 1 hour

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
