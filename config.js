// Load .env into process.env
require('dotenv').config();

const env = process.env;

exports.nodeEnv = env.NODE_ENV || 'development';

exports.logStars = (message) => {
    console.info('****************');
    console.info(message);
    console.info('****************');
};

exports.jwtSecret = env.JWT_SECRET;

module.exports = {
    port: env.PORT || 8000,
    hostname: env.HOSTNAME || 'localhost'
};