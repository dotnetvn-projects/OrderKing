'use strict';
const express = require('express');
const userrouter = express.Router();
const moment = require('moment');
const response = require('../../models/model.response');
const service = require('../../services/service.user');
const common = require('../../common/common');
const io = require('../../common/io');

//get user info
userrouter.post('/get-info', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var result = await service.getUserInfoByAccessToken(accessToken);
        var message = common.createResponseMessage(result.model.userinfo,
            result.model.responsecode,
            result.model.statusmessage);

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
    }
    catch (err) {
        next(err);
    }
});

//edit user info
userrouter.post('/edit-info', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var userInfo = {
            fullname: req.body.FullName,
            email: req.body.Email,
            phonenumber: req.body.PhoneNumber,
            address: req.body.Address,
            address2: req.body.Address2,
            identitycard: req.body.IdentityCard
        };
        var accountId = await service.getAccountIdByAccessToken(accessToken);

        var result = await service.updateUserInfo(userInfo, accountId);

        var message = common.createResponseMessage(result.model.userinfo,
            result.model.responsecode,
            result.model.statusmessage);

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
    }
    catch (err) {
        next(err);
    }
});

//update avatar
userrouter.post('/change-avatar', async function (req, res, next) {
    try {
        var accessToken = req.body.AccessToken;
        var avatarImage = req.body.AvatarImage;
        var accountId = await service.getAccountIdByAccessToken(accessToken);

        var result = await service.updateAvartar({
            avatar: avatarImage,
            accountid: accountId
        });

        var message = common.createResponseMessage(null,
            result.model.responsecode,
            result.model.statusmessage);

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
    }
    catch (err) {
        next(err);
    }
});

//update password
userrouter.post('/change-pass', async function (req, res, next) {
    try {
        var accessToken = req.body.AccessToken;
        var password = req.body.Password;
        var accountId = await service.getAccountIdByAccessToken(accessToken);

        var result = await service.changePassword({
            password: password,
            accountid: accountId
        });

        var message = common.createResponseMessage(result.model.userinfo,
            result.model.responsecode,
            result.model.statusmessage);

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
    }
    catch (err) {
        next(err);
    }
});

//get avatar
userrouter.get('/avatar', async function (req, res, next) {
    try {
        var accessToken = req.query.access_token;

        var accountId = await service.getAccountIdByAccessToken(accessToken);

        var result = await service.getAvatar(accountId);
        var img = null;

        if (result.model.userinfo === null) {
            var defaultImg = io.readFileToBinary('./resources/images/no-avatar.png');
            img = defaultImg;
        }
        else {
            img = new Buffer(result.model.userinfo);
        }

        res.writeHead(result.model.responsecode, {
            'Content-Type': 'image/jpeg',
            'Content-Length': img.length
        });
        res.end(img); 
    }
    catch (err) {
        next(err);
    }
});

module.exports = userrouter;