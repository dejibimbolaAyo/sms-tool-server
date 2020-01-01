const appRoot = require('app-root-path');
const mongoose = require(`${appRoot}/database/config/connection`);

let Schema = mongoose.Schema;

const smsSchema = new Schema({
	content: {
		type: String
	},
	recepients: {
		type: Number
	},
	cost: {
		type: String
	},
	deliveryReport: {
		type: Number
	}
}, {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

module.exports = mongoose.model('Sms', smsSchema, 'sms');

