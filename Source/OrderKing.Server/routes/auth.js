'use strict';
const service = require('../services/authservice');
const express = require('express');
const authrouter = express.Router();

const error = { ErrorCode:'', ErrorMessage :'' };

//index page
authrouter.get('/', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<center><b>Authentication Api</b></center>');
});

//auth user api
authrouter.post('/authuser', async function (req, res) {
    console.log('authuser api is called');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    var data = await service.executeAuth('linh.pham', '123456');
    if (data.length > 0) {
        var json = JSON.stringify(data[0]);
        res.end(json);
    }
    else {
        error.ErrorCode = 400;
        error.ErrorMessage = 'Error';
        res.sendStatus(error.ErrorCode);
        res.end(JSON.stringify(error));
    }
});

//auth user api
authrouter.post('/authuser', async function (req, res) {
    console.log('authuser api is called');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    var data = await service.executeAuth();
    var json = JSON.stringify(data[0]);
    res.end(json);
});

//export for outside
module.exports = authrouter;