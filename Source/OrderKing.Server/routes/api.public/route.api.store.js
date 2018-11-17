const express = require('express');
const storerouter = express.Router();
const service = require('../../services/service.store');
const userService = require('../../services/service.user');
const common = require('../../common/common');
const status = require('../../resources/resource.api.status');
const format = require('string-format');
const security = require('../../services/service.security');

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
            var account = await userService.getAccountByAccountName(req.body.AccountName);

            if (storeId === -1 || account === null) {
                common.sendBadRequest(res, 'Request data is invalid !');
            }
            else {
                var info = {
                    memberid: account.Id,
                    storeid: storeId
                };

                var result = await service.addNewMember(info);

                var message = common.createResponseMessage(
                    format('{0} has been added to store successfully!', account.AccountName),
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
            var account = await userService.getAccountByAccountName(req.body.AccountName);

            if (storeId === -1 || account === null) {
                common.sendBadRequest(res, 'Request data is invalid !');
            }
            else {
                var info = {
                    memberid: account.Id,
                    storeid: storeId
                };

                var result = await service.removeMember(info);

                var message = common.createResponseMessage(
                    format('{0} has been removed from store successfully!', account.AccountName),
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

//update logo
storerouter.post('/update-logo', async (req, res) => {
    try {
        var accessToken = req.body.AccessToken;
        var isStoreOwner = await security.isStoreOwner(accessToken);

        if (isStoreOwner === false) {
            common.sendUnauthorizedRequest(res);
        }
        else {
            var storeId = await service.getStoreIdByAccessToken(accessToken);
            var logo = req.body.Logo;

            if (storeId === -1) {
                common.sendBadRequest(res, 'Request data is invalid !');
            }
            else {
                var info = {
                    logo: logo,
                    storeid: storeId
                };

                var result = await service.updateLogo(info);

                var message = common.createResponseMessage(null,
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

                var result = await service.getMemberInStore(storeId);
                var members = [];
                if (result.model.storeinfo.length > 0) {
                    result.model.storeinfo.forEach(function (value) {
                        members.push({
                            storename: value.StoreName,
                            accountname: value.AccountName,
                            fullname: value.FullName,
                            email: value.Email,
                            phonenumber: value.PhoneNumber,
                            address: value.Address,
                            address2: value.Address2,
                            identityCard: value.IdentityCard
                        });
                    });
                }

                var message = common.createResponseMessage(members,
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

//TODO: get order list
//TODO: search order

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
            identitycard: null
        };

        var accountResult = await userService.createNewAccount(accountInfo);
        if (accountResult.model.userinfo > 0) {
            var storeInfo = {
                storename: req.body.StoreName,
                email: req.body.Email,
                address: req.body.Address,
                phone: req.body.StorePhone,
                slogan: req.body.Slogan,
                owner: accountResult.model.userinfo
            };

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


module.exports = storerouter;