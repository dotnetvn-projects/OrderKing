'use strict';
const format = require('string-format');
const service = require('../services/service.auth');
const express = require('express');
const common = require('../common/common');
const authrouter = express.Router();
var logHandler = require('../eventHandlers/event.handler.log');

//index page
authrouter.get('/', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<center><b>Authentication Api</b></center>');
});

//auth user api
authrouter.post('/auth-token-status', async function (req, res, next) {
    try {
        var ip = req.connection.remoteAddress;
        logHandler.fire('info', format('ip [{0}] has requested for check token status', ip));

        var accesstoken = req.body.AccessToken;

        var result = await service.checkExpiredToken(accesstoken);

        var message = common.createResponseMessage({ isexpired: result.model.responsecode === 200 },
            result.model.responsecode, result.model.statusmessage);

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
    }
    catch (err) {
        next(err);
    }
});

//auth user api
authrouter.post('/auth-user', async function (req, res, next) {
    try {
        var ip = req.connection.remoteAddress;
        var userAgent = req.headers['user-agent'];
        logHandler.fire('info', format('ip [{0}] has requested for authentication', ip));
      
        var account = req.body.AccountName;
        var password = req.body.Password;
        var result = await service.executeAuth(account, password, ip, userAgent);

        var message = common.createResponseMessage(
            { accesstoken: result.model.accesstoken,
              expireddate: result.model.expireddate
            },
            result.model.responsecode,
            result.model.statusmessage);

        logHandler.fire('info', format('[{0}][ip {1}] has been authenticated sucessful', account, ip));

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json'});
        res.end(JSON.stringify(message));
    }
    catch (err) {
        next(err);
    }
});

//auth manager api
authrouter.post('/auth-manager', async function (req, res, next) {
    try {
        var ip = req.connection.remoteAddress;
        var userAgent = req.headers['user-agent'];
        logHandler.fire('info', format('ip [{0}] has requested for authentication', ip));

        var account = req.body.AccountName;
        var password = req.body.Password;
        var result = await service.executeManageAuth(account, password, ip, userAgent);

        var message = common.createResponseMessage(
            {
                accesstoken: result.model.accesstoken,
                expireddate: result.model.expireddate
            },
            result.model.responsecode,
            result.model.statusmessage);

        logHandler.fire('info', format('[{0}][ip {1}] has been authenticated sucessful', account, ip));

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
    }
    catch (err) {
        next(err);
    }
});

//remove auth
authrouter.post('/remove-auth', async function (req, res, next) {
    try {
        var accessToken = req.body.AccessToken;
        var result = await service.removeAuth(accessToken);

        var message = common.createResponseMessage(
            {accesstoken: accessToken, expireddate: result.model.expireddate},
            result.model.responsecode,
            result.model.statusmessage);

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
    }
    catch (err) {
        next(err);
    }
});

module.exports = authrouter;