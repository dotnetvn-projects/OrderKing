'use strict';
const service = require('../services/authservice');
const response = require('../models/response');
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
   
    var message = response.model;

    res.writeHead(200, { 'Content-Type': 'application/json' });

    if (security.isValidRequest(req) === false) {
        logHandler.fire('error', 'loi roi');
        message.ResponseCode = 401;
        message.StatusMessage = 'Unauthorized request';
        res.end(JSON.stringify(message));    
    }
    else {      
        var account = req.body.AccountName;
        var password = req.body.Password;
        logHandler.fire('info', '[' + account + '] call auth user api');

        var result = await service.executeAuth(account, password);

        message.ResponseCode = result.model.ResponseCode;
        message.StatusMessage = result.model.StatusMessage;

        if (result.model.AccessToken !== '') {
            var data = {
                AccessToken: result.model.AccessToken,
                ExpiredDate: result.model.ExpiredDate
            };
            message.Result = data;
        }

        res.end(JSON.stringify(message));
    }
});

//export for outside
module.exports = authrouter;