const SmsTemplate = require("../models/smstemplate");
const pug = require("pug");

/**
 * Render sms template with data
 * @param {*} template 
 * @param {*} data 
 */
exports.render = async (data,templateType) => {
    const template = await getTemplate(templateType);
    if(template) {
        const compiledFunction = pug.compile(template.content);
        const message = compiledFunction(data);
        // Strip out tags
        return stripHtml(message)
    } return false;
}

// Fet the template to use with SMS
async function getTemplate(templateType) {
    const template = await SmsTemplate.findOne({messageType: templateType});
    return template;
}

function stripHtml(html){
    return html.replace(/<[^>]+>/g, '');
}