'use strict';
const service = require('../services/authservice');
const response = require('../models/response');
const express = require('express');
const authrouter = express.Router();


//index page
authrouter.get('/', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<center><b>Authentication Api</b></center>');
});

//auth user api
authrouter.post('/authuser', async function (req, res) {
    console.log('authuser api is called');
    var message = response.model;

    var account = req.body.AccountName;
    var password = req.body.Password;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    
    var data = await service.executeAuth(account, password);
    if (data.length > 0) {
        message.Result = JSON.stringify(data[0]);
        res.end(JSON.stringify(message));
    }
    else {
        message.ErrorCode = 404;
        message.ErrorMessage = 'Not Found';
        res.statusCode = message.ErrorCode;
        res.end(JSON.stringify(message));
    }
});

//export for outside
module.exports = authrouter;