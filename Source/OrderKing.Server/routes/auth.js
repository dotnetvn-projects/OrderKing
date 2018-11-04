'use strict';
const format = require('string-format');
const service = require('../services/authservice');
const response = require('../models/response');
const common = require('../common/common');
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
authrouter.post('/auth-user', async function (req, res) {
    var ip = req.connection.remoteAddress;
    var userAgent = req.headers['user-agent'];
    var message = null;
    logHandler.fire('info', format('ip [{0}] has requested for authentication', ip));

    res.writeHead(200, { 'Content-Type': 'application/json' });

    var account = req.body.AccountName;
    var password = req.body.Password;
    var result = await service.executeAuth(account, password, ip, userAgent);

    message = createSuccessMessage(result.model.accesstoken, result.model.expireddate,
        result.model.responsecode, result.model.statusmessage);

    logHandler.fire('info', format('[{0}][ip {1}] has been authenticated sucessful', account, ip));
    res.end(JSON.stringify(message));
    
});

//remove auth
authrouter.post('/remove-auth', async function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    var accessToken = req.body.AccessToken;
    var result = await service.removeAuth(accessToken);
    var message = createSuccessMessage(accessToken, result.model.expireddate,
        result.model.responsecode, result.model.statusmessage);
    res.end(JSON.stringify(message));    
});

//helper method
function createSuccessMessage(accessToken, expiredDate,
    responseCode, status) {

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
//end helper method

module.exports = authrouter;