const logger = require("../config/logger");
const axios = require("axios");

let Queue = require("bull");
let GoogleSheet = require("../services/googlesheets");
let Sms = require("../services/sms");
let smsQueue = new Queue('smsQueue');
let dailyRunnerQueue = new Queue('dailyRunnerQueue');

exports.queueSms = async (job) => {
    // this will do the heavy lifting for sending out sms
	smsQueue.add(job);
}

exports.dailyBirthdayReminder = () => {
	dailyRunnerQueue.add({}, {repeat: {cron: '15 3 * * *'}});
}

smsQueue.process(function(job, done) {
	const receivers = job.data.contact;
	const message = job.data.message;

	if (receivers.length === 0) return;
	if (message === "") return;

	const smsUsername = process.env.SMARTSMS_USERNAME;
	const smsPassword = process.env.SMARTSMS_PASSWORD;
	const sender = process.env.SENDER;

	const smsRequestString = `http://api.smartsmssolutions.com/smsapi.php?username=${smsUsername}&password=${smsPassword}&sender=${sender}&recipient=${receivers}&message=${message}`
	axios.get(smsRequestString)
		.then(function (response) {
			// handle success
			logger.info("Messages sent", response.status);
			return response
		})
		.catch(function (error) {
			// handle error
			logger.error("Error sending SMS", error.message);
			return error;
		})
	done();
	return true;
})

dailyRunnerQueue.process(async (job, done) => {
	// Todo: determine what number to send a message to by 3:15AM
	let contacts = await GoogleSheet.getBirthdayCelebrants();

	Sms.send(contacts, undefined, undefined, "birthday_message")
	// console.log(contacts);
	// if (contacts && contacts.length > 0) {
	// 	contacts = Sms.findUniqueContacts(contacts);
	// 	// Randomize birthday message
	// 	const templateType = 'birthday_message';
	// 	// Send personalized messages
	// 	contacts.forEach(async contact => {
	// 		message = await Sms.prepareMessage(templateType, contact);
	// 		smsQueue.add({contact, message});
	// 	});
	// }
})