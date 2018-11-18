const express = require('express');
const catalogrouter = express.Router();
const service = require('../../services/service.catalog');
const storeService = require('../../services/service.store');
const security = require('../../services/service.security');
const common = require('../../common/common');

//****when implement getting list of category or product,
//do encrypting id before send respone message for client
//use encrypt function of security has been declared above*****
// example: var id = security.encrypt(recordset.id);

//****for modifying functions as : update or delete category and product
//    do decrypting id from client first*****
// example: var categoryId = security.decrypt(res.body.Id);

//create new category
catalogrouter.post('/create-category', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var isStoreOwner = await security.isStoreOwner(accessToken);

        if (isStoreOwner === false) {
            common.sendUnauthorizedRequest(res);
        }
        else {
            var storeId = await storeService.getStoreIdByAccessToken(accessToken);
            var category = {
                storeId: storeId,
                name: req.body.Name
            };

            var result = await service.createCatagory(category);

            var message = common.createResponseMessage(result.model.category,
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

//update category
//Need to fix: update only category name
//need to fix: call decrypt id 
catalogrouter.post('/update-category', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var isStoreOwner = await security.isStoreOwner(accessToken);

        if (isStoreOwner === false) {
            common.sendUnauthorizedRequest(res);
        }
        else {

            var storeId = await storeService.getStoreIdByAccessToken(accessToken);
            var category = {
                storeId: storeId,
                name: req.body.Name,
                id: req.body.Id,
                isActived: req.body.IsActived
            };

            var result = await service.updateCatagory(category);

            var message = common.createResponseMessage(result.model.category,
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

//deactive category
//need to fix: call decrypt id 
catalogrouter.post('/delete-category', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var isStoreOwner = await security.isStoreOwner(accessToken);

        if (isStoreOwner === false) {
            common.sendUnauthorizedRequest(res);
        }
        else {
            var categoryId = req.body.Id;

            var result = await service.deactivateCategory(categoryId);

            var message = common.createResponseMessage(null,
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


module.exports = catalogrouter;