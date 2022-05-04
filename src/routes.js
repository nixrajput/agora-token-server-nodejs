const router = require("express").Router();
const { generateRtcToken, generateRtmToken } = require("./controllers");

router.route("/rtcToken").get(generateRtcToken);
router.route("/rtmToken").get(generateRtmToken);

module.exports = router;
