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

    var fullName = req.body.FullName;
    var email = req.body.Email;
    var phoneNumber = req.body.PhoneNumber;
    var address = req.body.Address;
    var address2 = req.body.Address2;
    var identityCard = req.body.IdentityCard;
    var accountId = req.body.AccountId;

    var result = await service.updateUserInfo({
        FullName: fullName,
        Email: email,
        PhoneNumber: phoneNumber,
        Address: address,
        Address2: address2,
        IdentityCard: identityCard,
        AccountId: accountId
    });

    var message = createResponseMessage(result.model.userinfo,
        result.model.responsecode,
        result.model.statusmessage);

    res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(message));
});

//update avatar
userrouter.post('/change-avatar', async function (req, res) {

    var avatarImage = req.body.AvatarImage;
    var accountId = req.body.AccountId;

    var result = await service.updateAvartar({
        AvatarImage: avatarImage,
        AccountId: accountId
    });

    var message = createResponseMessage(result.model.userinfo,
        result.model.responsecode,
        result.model.statusmessage);

    res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(message));
});


//update password
userrouter.post('/change-pass', async function (req, res) {

    var password = req.body.Password;
    var accountId = req.body.AccountId;

    var result = await service.changePassword({
        Password: password,
        AccountId: accountId
    });

    var message = createResponseMessage(result.model.userinfo,
        result.model.responsecode,
        result.model.statusmessage);

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