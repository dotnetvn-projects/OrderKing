'use strict';
const service = require('../services/authservice');
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
    res.writeHead(200, { 'Content-Type': 'application/json' });
    var data = await service.executeAuth();
    var json = JSON.stringify(data);
    res.end(json);
});

//export for outside
module.exports = authrouter;