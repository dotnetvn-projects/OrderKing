'use strict';
const express = require('express');
const userrouter = express.Router();
const response = require('../../models/model.response');
const service = require('../../services/service.user');

//get user info
userrouter.post('/get-info', async function (req, res) {
    var accessToken = req.body.AccessToken;

    var result = await service.GetUserInfoByAccessToken(accessToken);
    var message = createResponseMessage(result.model.userinfo, 
        result.model.responsecode,
        result.model.statusmessage);

    res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(message));    
});

//edit user info
userrouter.post('/edit-info', async function (req, res) {
    var accessToken = req.body.AccessToken;

    var result = await service.GetUserInfoByAccessToken(accessToken);
    var message = null;

    res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(message));
});



//helper method
function createResponseMessage(userinfo, responseCode, status) {
    var message = response.model;
    message.responsecode = responseCode;
    message.statusmessage = status;
    message.responsedate = moment().format('DD/MM/YYYY HH:mm:ss');
    message.result = userinfo;  
    return message;
}
//end helper method

module.exports = userrouter;