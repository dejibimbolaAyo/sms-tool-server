const appRoot = require('app-root-path');
const mongoose = require(`${appRoot}/database/config/connection`);

let Schema = mongoose.Schema;

const smsTemplateSchema = new Schema({
	content: {
		type: String
	},
	variable: {
		type: [String]
    },
    templateEngine: String
}, {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

module.exports = mongoose.model('SmsTemplate', smsTemplateSchema, 'smstemplate');

