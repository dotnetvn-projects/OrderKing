'use strict';
const express = require('express');
const userrouter = express.Router();
const service = require('../../services/service.user');
const common = require('../../common/common');
const imageProcess = require('../../common/image.process');
const io = require('../../common/io');
const resources = require('../../resources/resource.api.value');
const security = require('../../services/service.security');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

//check the existence of user in database
userrouter.post('/check-exist-account', async (req, res, next) => {
    try {
        var acountName = req.body.AccountName;
        var result = await service.CheckExist(acountName);
        var message = common.createResponseMessage(result,
            result.model.responsecode,
            result.model.statusmessage);

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
    }
    catch (err) {
        next(err);
    }
});

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
userrouter.post('/change-avatar', multipartMiddleware, async function (req, res, next) {
    try {
        var accessToken = req.body.AccessToken;
        var accountId = await service.getAccountIdByAccessToken(accessToken);

        var buff = io.readFileToBinary(req.files.Avatar.path);

        imageProcess.resizeAutoScaleHeight(buff, resources.avatarSize.W, async (imageData) => {
            var result = await service.updateAvartar({
                avatar: imageData,
                accountid: accountId
            });

            io.deleteFile(req.files.Avatar.path);

            var message = common.createResponseMessage(null,
                result.model.responsecode,
                result.model.statusmessage);

            res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(message));
        });
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
        var accountId = -1;
        var accessToken = req.query.access_token;

        if (accessToken === undefined) {
            var memberid = security.decrypt(req.query.member).split('_')[0];
            var account = await service.getAccountByAccountId(memberid);
            accountId = account.Id;
        }
        else {
            accountId = await service.getAccountIdByAccessToken(accessToken);
        }
        var result = await service.getAvatar(accountId);
        var img = new Buffer(result.model.userinfo);

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