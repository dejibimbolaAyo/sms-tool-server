const SmsTemplate = require("../models/smstemplate");
const pug = require("pug");

/**
 * Render sms template with data
 * @param {*} template 
 * @param {*} data 
 */
exports.render = async (templateId, data) => {
    const template = await getTemplate(templateId);
    const compiledFunction = pug.compile(template.content);
    const message = compiledFunction(data);
	// Strip out tags
	return stripHtml(message)
}

// Fet the template to use with SMS
async function getTemplate(templateId) {
    const template = await SmsTemplate.findById(templateId);
    return template;
}

function stripHtml(html){
    return html.replace(/<[^>]+>/g, '');
}