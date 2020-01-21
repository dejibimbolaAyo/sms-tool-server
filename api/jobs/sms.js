let Queue = require("bull");

let smsQueue = new Queue('smsQueue');

exports.queueSms = async (job) => {
    // this will do the heavy lifting for sending out sms
	smsQueue.add(job);
}

smsQueue.process(function(job, done) {
	const receivers = job.data.contact;
	const message = job.data.message;

	if (receivers.length === 0) return;
	if (message === "") return;

	const smsUsername = process.env.SMARTSMS_USERNAME;
	const smsPassword = process.env.SMARTSMS_PASSWORD;
	const sender = process.env.SENDER;
	done();
	return true
	// const smsRequestString = `http://api.smartsmssolutions.com/smsapi.php?username=${smsUsername}&password=${smsPassword}&sender=${sender}&recipient=${receivers}&message=${message}`
	// return axios.get(smsRequestString)
	// 	.then(function (response) {
	// 		// handle success
	// 		return response
	// 	})
	// 	.catch(function (error) {
	// 		// handle error
	// 		return error;
	// 	})
})