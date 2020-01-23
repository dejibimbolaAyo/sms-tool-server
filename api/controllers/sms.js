const logger = require("../config/logger");
const Sms = require("../services/sms");
const {HTTP_STATUS} = require("../constants/httpStatus");

let {error, success} = require("../constants/response");
let response = require("../common/responseWriter");

/**
 * Create user
 */
exports.sendSms = async function (req, res) {
    const {contactFile, query, messageType, personalized} = req.body
  
    if (!messageType) {
      error.message = `Please you cannot send an empty message`;
      logger.log("info", error.message);
      return response.writeJson(res, error, HTTP_STATUS.BAD_REQUEST.CODE)
    }
  
    try {
        const result = await Sms.send(contactFile, query, messageType, personalized);
  
        success.data = result;
        return response.writeJson(res, success, HTTP_STATUS.OK.CODE)
    } catch (err) {
      logger.log("error", `Error occured, ${err}`);
      error.message = err.message || err._message;
      return response.writeJson(res, error, HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE)
    }
  }