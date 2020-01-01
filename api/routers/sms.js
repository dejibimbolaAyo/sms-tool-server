const Router = require("./index");
const Base = require("./base")
const SmsController = require("./../controllers/sms");

Router.post('/sms/send', SmsController.sendSms);

module.exports = Router;
