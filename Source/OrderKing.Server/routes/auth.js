'use strict';
const format = require('string-format');
const service = require('../services/authservice');
const response = require('../models/response');
const status = require('../resources/response-status');
const express = require('express');
const authrouter = express.Router();
const security = require('../services/securityservice');
var logHandler = require('../eventHandlers/log-handler');

//index page
authrouter.get('/', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<center><b>Authentication Api</b></center>');
});

//auth user api
authrouter.post('/authuser', async function (req, res) {
    var ip = req.connection.remoteAddress;
    var userAgent = req.headers['user-agent'];
    var message = null;
    logHandler.fire('info', format('ip [{0}] has requested for authentication', ip));
   
    res.writeHead(200, { 'Content-Type': 'application/json' });
    try {
        if (security.isValidRequest(req) === false) {
            logHandler.fire('error', format('ip [{0}] {1} ', ip, 'has been rejected by server when calling authentication'));
            message = createErrorMessage();
        }
        else {
            var account = req.body.AccountName;
            var password = req.body.Password;
            var result = await service.executeAuth(account, password, ip, userAgent);

            message = createSuccessMessage(result.model.accesstoken, result.model.expireddate,
                result.model.responsecode, result.model.statusmessage);

            logHandler.fire('info', format('[{0}][ip {1}] has been authenticated sucessful', account, ip));
        }       
    }
    catch (ex) {
        logHandler.fire('error', format('there is an error occurred while executing authentication for ip [{0}]', ip));
        logHandler.fire('error', ex);
        message = createErrorMessage();
    }
    res.end(JSON.stringify(message));
});

function createErrorMessage() {
    var message = response.model;
    message.responsecode = status.invalidRequest.code;
    message.statusmessage = status.invalidRequest.message;
    message.result = null;
    return message;
}

function createSuccessMessage(accessToken, expiredDate, responseCode, status) {
    var message = response.model;
    message.responsecode = responseCode;
    message.statusmessage = status;

    if (accessToken !== '') {
        var data = {
            accesstoken: accessToken,
            expireddate: expiredDate
        };
        message.result = data;
    }
    return message;
}

//export for outside
module.exports = authrouter;