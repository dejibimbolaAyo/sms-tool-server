const _ = require("underscore");
const SmsModel = require("../models/sms");
const SmsTemplateService = require("../services/smstemplate")
const GoogleSheet = require("../services/googlesheets");
const SmsQueue = require("../jobs/sms");

exports.send = async (contactListFile, query, message, personalized = false) => {
	let deliveryCount = 0;
	let cost = "";
	let contacts = await readContactFromExcelSheet(contactListFile, query);
	let recepientCount = contacts.length
	let response = "";

	if (contacts && contacts.length > 0) {
		contacts = findUniqueContacts(contacts);
		if (personalized) {
			const templateId = message
			// Send personalized messages
			contacts.forEach(async contact => {
				message = await prepareMessage(templateId, contact)
				SmsQueue.queueSms({
					contact: contact.phoneNumber,
					message
				});
			});
		} else {
			// Send bulk messages
			contacts = prepareRecepients(contacts);
			SmsQueue.queueSms({
				contact: contact.phoneNumber,
				message
			});
		}
	}
	response ? deliveryCount = response.split(" ")[1] : deliveryCount = 0;
	// Get deliveryCount from response on send message, same as cost if available
	return persistMessageRecords(recepientCount, message, deliveryCount, cost)
}

/**
 * Fetch unique phone numbers from a list of Phone Numbers
 */
const findUniqueContacts = (contacts = []) => {
	let uniqueNumbers = _.uniq(_.pluck(contacts, 'phoneNumber'));
	let uniqueContacts = []
	_.map(contacts, (contact) => {
		return _.find(uniqueNumbers, (uniqueNumber) => {
			if (uniqueNumber === contact.phoneNumber) {
				uniqueNumbers = _.without(uniqueNumbers, uniqueNumber)
				contact.phoneNumber = sanitizePhoneNumber(uniqueNumber);
				uniqueContacts.push(contact)
			}
		})
	})
	return uniqueContacts;
}

/**
 * Read contact details from an Excell sheet containing contacts
 * @param {*} query 
 */
const readContactFromExcelSheet = (file = process.env.DEFAULT_CONTACT_LIST, query = {}) => {
	// Validate file
	try {
		return GoogleSheet.getSheetContent(file);
	} catch (error) {
		console.log("Error fetching Google contacts", error.message);
	}
}

/**
 * Add receiver details (name and other identities) to message
 * @param {*} receiver 
 * @param {*} message 
 */
const prepareMessage = async (templateId, receiver) => {
	// TODO: strip off the tags in this as pug returns an HTML element
	const message = await SmsTemplateService.render(templateId, receiver);
	return message;
}

const prepareRecepients = (contacts) => {
	let phoneNumbers = _.pluck(contacts, 'phoneNumber');
	// Todo: test number validity
	return phoneNumbers.join(", ")
}

const sanitizePhoneNumber = (number) => {
	if (number.length == 10) {
		return "234" + number
	}
	if (number.length == 11) {
		number = "234" + number.substring(1)
		return number
	}
	if (number.length == 13) {
		return number
		console.log("13", number)
	}
	if (number.length == 14) {
		return number.substring(1)
	}
	return number
}

/**
 * Save message details
 * @param {*} recepientCount 
 * @param {*} message 
 * @param {*} deliveryCount 
 * @param {*} cost 
 */
const persistMessageRecords = async (recepientCount = 0, message = "", deliveryCount = 0, cost = "0.0", log = "") => {
	const messageRecord = await SmsModel.create({
		recepients: recepientCount,
		deliveryReport: deliveryCount,
		content: message,
		cost: cost,
		log: log
	});

	return messageRecord;
}
