const config = require('./config');
const userRouter = require("./api/routers/user");
const smsRouter = require("./api/routers/sms");
const express = require("express");

const server = express();
server.use('/api/v1/', userRouter);
server.use('/api/v1/', smsRouter);

// Start server
server.listen(config.port, () => {
    console.info('Quick server is started on', config.hostname +':'+ config.port);
});