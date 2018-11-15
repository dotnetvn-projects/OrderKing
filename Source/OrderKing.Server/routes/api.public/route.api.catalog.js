const express = require('express');
const catalogrouter = express.Router();
const service = require('../../services/service.catalog');
const userService = require('../../services/service.user');
const response = require('../../models/model.response');
const moment = require('moment');
//code here

module.exports = catalogrouter;

catalogrouter.post('/create-category', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var category = {
            storeId: req.body.StoreId,
            name: req.body.Name
        };

        var accountId = await userService.getAccountIdByAccessToken(accessToken);

        var result = await service.createCatagory(category);

        var message = createResponseMessage(result.model.category,
            result.model.responsecode,
            result.model.statusmessage);

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
    }
    catch (err) {
        next(err);
    }
});

catalogrouter.post('/update-category', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var category = {
            storeId: req.body.StoreId,
            name: req.body.Name,
            id: req.body.Id,
            isActived: req.body.IsActived
        };

        var accountId = await userService.getAccountIdByAccessToken(accessToken);

        var result = await service.updateCatagory(category);

        var message = createResponseMessage(result.model.category,
            result.model.responsecode,
            result.model.statusmessage);

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
    }
    catch (err) {
        next(err);
    }
});

catalogrouter.post('/delete-category', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var categoryId = req.body.Id;

        var accountId = await userService.getAccountIdByAccessToken(accessToken);

        var result = await service.deactivateCategory(categoryId);

        var message = createResponseMessage(null,
            result.model.responsecode,
            result.model.statusmessage);

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
    }
    catch (err) {
        next(err);
    }
});


//helper method
var createResponseMessage = function (category, responseCode, status) {
    var message = response.model;
    message.responsecode = responseCode;
    message.statusmessage = status;
    message.responsedate = moment().format('DD/MM/YYYY HH:mm:ss');
    message.result = category;
    return message;
};
//end helper method