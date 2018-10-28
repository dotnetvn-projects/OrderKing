'use strict';
const service = require('../services/authservice');
const response = require('../models/response');
const express = require('express');
const authrouter = express.Router();
const logger = require('../services/logservice');

//index page
authrouter.get('/', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<center><b>Authentication Api</b></center>');
});

//auth user api
authrouter.post('/authuser', async function (req, res) {

    res.writeHead(200, { 'Content-Type': 'application/json' }); 
    var account = req.body.AccountName;
    var password = req.body.Password;
    var message = response.model;

    logger.Info('[' + account+'] call auth user api');

    var result = await service.executeAuth(account, password);

    message.ResponseCode = result.model.ResponseCode;
    message.Message = result.model.Status;

    if (result.model.AccessToken !== '') {
        var data = {
            AccessToken: result.model.AccessToken,
            ExpiredDate: result.model.ExpiredDate
        };
        message.Result = JSON.stringify(data);       
    }

    res.end(JSON.stringify(message));
});

//export for outside
module.exports = authrouter;