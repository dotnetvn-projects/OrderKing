const express = require('express');
const storerouter = express.Router();
const service = require('../../services/service.store');
const userService = require('../../services/service.user');
const common = require('../../common/common');
const status = require('../../resources/resource.api.status');
const format = require('string-format');
const security = require('../../services/service.security');
const io = require('../../common/io');
const resources = require('../../resources/resource.api.value');
const imageProcess = require('../../common/image.process');
const moment = require('moment');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

//url: /api/public/store
//get store info
storerouter.post('/get-info', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;

        var result = await service.getStoreInfoByAccessToken(accessToken);

        var message = common.createResponseMessage(result.model.storeinfo,
            result.model.responsecode,
            result.model.statusmessage);

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
    }
    catch (err) {
        next(err);
    }
});

//edit store info
storerouter.post('/edit-info', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var storeInfo = {
            storename: req.body.StoreName,
            email: req.body.Email,
            address: req.body.StoreAddress,
            phone: req.body.Phone,
            slogan: req.body.Slogan
        };
        var storeId = await service.getStoreIdByAccessToken(accessToken);

        var result = await service.updateStoreInfo(storeInfo, storeId);

        var message = common.createResponseMessage(result.model.storeinfo,
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
storerouter.post('/get-member-info', async (req, res, next) => {
    try {
        var memberId = security.decrypt(req.body.MemberId).split('_')[0];

        var result = await userService.getUserInfoById(parseInt(memberId));

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

//add new member to store
storerouter.post('/add-member', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var isStoreOwner = await security.isStoreOwner(accessToken);

        if (isStoreOwner === false) {
            common.sendUnauthorizedRequest(res);
        }
        else {
            var storeId = await service.getStoreIdByAccessToken(accessToken);        
            if (storeId === -1 ) {
                common.sendBadRequest(res, 'Request data is invalid !');
            }
            else {

                var accountInfo = {
                    accountname: req.body.AccountName,
                    password: req.body.Password,
                    fullname: req.body.FullName,
                    email: req.body.Email,
                    phonenumber: req.body.PhoneNumber,
                    address: req.body.Address,
                    address2: req.body.Address2,
                    identitycard: req.body.IdentityCard,
                    avatar: null
                };

                accountInfo.avatar = io.readFileToBinary('./resources/images/no-avatar.png');

                var accountResult = await userService.createNewAccount(accountInfo);

                var info = {
                    storeid: storeId,
                    memberid: accountResult.model.userinfo
                };

                var result = await service.addNewMember(info);

                var message = common.createResponseMessage(
                    { staffid: security.encrypt(info.memberid.toString()+ '_' + security.serverKey()) },
                    result.model.responsecode,
                    result.model.statusmessage);

                res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(message));
            }
        }
    }
    catch (err) {
        next(err);
    }
});

//remove member from store
storerouter.post('/remove-member', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var isStoreOwner = await security.isStoreOwner(accessToken);

        if (isStoreOwner === false) {
            common.sendUnauthorizedRequest(res);
        }
        else {
            var storeId = await service.getStoreIdByAccessToken(accessToken);
            var accountId = security.decrypt(req.body.MemberId).split('_')[0];

            if (storeId === -1 || !common.isNumber(accountId)) {
                common.sendBadRequest(res, 'Request data is invalid !');
            }
            else {
                var info = {
                    memberid: accountId,
                    storeid: storeId
                };

                var result = await service.removeMember(info);

                var message = common.createResponseMessage(
                   'Account has been removed from store successfully!',
                    result.model.responsecode,
                    result.model.statusmessage);

                res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(message));
            }
        }
    }
    catch (err) {
        next(err);
    }
});

//edit member info from store
storerouter.post('/edit-member-info', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var isStoreOwner = await security.isStoreOwner(accessToken);

        if (isStoreOwner === false) {
            common.sendUnauthorizedRequest(res);
        }
        else {
            var memberId = security.decrypt(req.body.MemberId).split('_')[0];
           
            var userInfo = {
                memberid: '',
                fullname: req.body.FullName,
                email: req.body.Email,
                phonenumber: req.body.PhoneNumber,
                address: req.body.Address,
                address2: req.body.Address2,
                identitycard: req.body.IdentityCard
            };

            var result = await userService.updateUserInfo(userInfo, memberId);

            var message = common.createResponseMessage(
                { staffid: security.encrypt(memberId.toString() + '_' + security.serverKey())},
             result.model.responsecode,
             result.model.statusmessage);

            res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(message));
        }
    }
    catch (err) {
        next(err);
    }
});

//edit member avatar from store
storerouter.post('/edit-member-avatar', multipartMiddleware, async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var isStoreOwner = await security.isStoreOwner(accessToken);

        if (isStoreOwner === false) {
            common.sendUnauthorizedRequest(res);
        }
        else {
            var memberId = security.decrypt(req.body.MemberId).split('_')[0];
            var buff = io.readFileToBinary(req.files.Avatar.path);

            imageProcess.resizeAutoScaleHeight(buff, resources.avatarSize.W, async (imageData) => {
                var result = await userService.updateAvartar({
                    avatar: imageData,
                    accountid: memberId
                });

                io.deleteFile(req.files.Avatar.path);

                var message = common.createResponseMessage(null,
                    result.model.responsecode,
                    result.model.statusmessage);

                res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(message));
            });
        }
    }
    catch (err) {
        next(err);
    }
});

//update logo
storerouter.post('/update-logo', multipartMiddleware, async (req, res) => {
    try {
        var accessToken = req.body.AccessToken;
        var isStoreOwner = await security.isStoreOwner(accessToken);

        if (isStoreOwner === false) {
            common.sendUnauthorizedRequest(res);
        }
        else {
            var storeId = await service.getStoreIdByAccessToken(accessToken);

            if (storeId === -1) {
                common.sendBadRequest(res, 'Request data is invalid !');
            }
            else {
                var buff = io.readFileToBinary(req.files.StoreLogo.path);
                imageProcess.resizeAutoScaleHeight(buff, resources.storeLogoSize.W, async (imageData) => {
                    var info = {
                        logo: imageData,
                        storeid: storeId
                    };

                    var result = await service.updateLogo(info);

                    io.deleteFile(req.files.StoreLogo.path);

                    var message = common.createResponseMessage(null,
                        result.model.responsecode,
                        result.model.statusmessage);

                    res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(message));
                });
            }
        }
    }
    catch (err) {
        next(err);
    }
});

//get member in store
storerouter.post('/get-member-list', async (req, res) => {
    try {
        var accessToken = req.body.AccessToken;
        var isStoreOwner = await security.isStoreOwner(accessToken);

        if (isStoreOwner === false) {
            common.sendUnauthorizedRequest(res);
        }
        else {
            var storeId = await service.getStoreIdByAccessToken(accessToken);

            if (storeId === -1) {
                common.sendBadRequest(res, 'Request data is invalid !');
            }
            else {
                var currentAccountId = await userService.getAccountIdByAccessToken(accessToken);
                var result = await service.getMemberInStore(storeId, currentAccountId);
                var message = common.createResponseMessage(result.model.storeinfo,
                    result.model.responsecode,
                    result.model.statusmessage);

                res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(message));
            }
        }
    }
    catch (err) {
        next(err);
    }
});

//create new store and account
storerouter.post('/create-new', async (req, res, next) => {
    try {
        var responsecode = status.common.failedcode;
        message = common.createResponseMessage(null,
            responsecode,
            status.common.failed);

        var accountInfo = {
            accountname: req.body.Email,
            password: req.body.Password,
            fullname: req.body.FullName,
            email: req.body.Email,
            phonenumber: req.body.StorePhone,
            address: req.body.Address,
            address2: null,
            identitycard: null,
            avatar: null
        };

        accountInfo.avatar = io.readFileToBinary('./resources/images/no-avatar.png');

        var accountResult = await userService.createNewAccount(accountInfo);
        if (accountResult.model.userinfo > 0) {
            var storeInfo = {
                storename: req.body.StoreName,
                email: req.body.Email,
                address: req.body.Address,
                phone: req.body.StorePhone,
                slogan: req.body.Slogan,
                owner: accountResult.model.userinfo,
                logo: null
            };

            storeInfo.logo = io.readFileToBinary('./resources/images/no-image.png');

            var storeResult = await service.createNewStore(storeInfo);
            if (storeResult.model.storeinfo > 0) {
                message = common.createResponseMessage(
                    format('{0} has been created successfully !', storeInfo.storename),
                    storeResult.model.responsecode,
                    storeResult.model.statusmessage);
                responsecode = storeResult.model.responsecode;
            }
        }

        res.writeHead(responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
    }
    catch (err) {
        next(err);
    }
});

//lock a member instore
storerouter.post('/lock-member', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var isStoreOwner = await security.isStoreOwner(accessToken);

        if (isStoreOwner === false) {
            common.sendUnauthorizedRequest(res);
        }
        else {
            var accountId = security.decrypt(req.body.MemberId).split('_')[0];
            var result = await userService.lockAccount(accountId);
            var message = common.createResponseMessage('Account has been locked !',
                result.model.responsecode, result.model.statusmessage);

            res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(message));
        }
    }
    catch (err) {
        next(err);
    }
});


//unlock a member instore
storerouter.post('/unlock-member', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var isStoreOwner = await security.isStoreOwner(accessToken);

        if (isStoreOwner === false) {
            common.sendUnauthorizedRequest(res);
        }
        else {
            var accountId = security.decrypt(req.body.MemberId).split('_')[0];
            var result = await userService.unLockAccount(accountId);
            var message = common.createResponseMessage('Account has been unlocked !',
                result.model.responsecode, result.model.statusmessage);

            res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(message));
        }
    }
    catch (err) {
        next(err);
    }
});

//get logo
storerouter.get('/logo', async (req, res, next) => {
    try {
        var accessToken = req.query.access_token;

        var result = await service.getLogo(accessToken);

        var img = new Buffer(result.model.storeinfo);

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

module.exports = storerouter;