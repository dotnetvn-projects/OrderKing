const express = require('express');
const catalogrouter = express.Router();
const service = require('../../services/service.catalog');
const storeService = require('../../services/service.store');
const security = require('../../services/service.security');
const common = require('../../common/common');
const io = require('../../common/io');

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
                name: req.body.Name,
                image:null
            };

            if (req.body.ImageDisplay === null || req.body.ImageDisplay === '' || req.body.ImageDisplay === undefined) {
                category.image = io.readFileToBinary('./resources/images/no-image.png');
            }
            else {
                category.image = new Buffer(req.body.ImageDisplay, 'base64');
            }
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
catalogrouter.post('/update-category', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var isStoreOwner = await security.isStoreOwner(accessToken);

        if (isStoreOwner === false) {
            common.sendUnauthorizedRequest(res);
        }
        else {
            var storeId = await storeService.getStoreIdByAccessToken(accessToken);
            var cateId = await security.decrypt(req.body.Id);

            var category = {
                storeId: storeId,
                name: req.body.Name,
                image: null,
                id: cateId
            };

            if (req.body.ImageDisplay === null || req.body.ImageDisplay === '' || req.body.ImageDisplay === undefined) {
                category.image = io.readFileToBinary('./resources/images/no-image.png');
            }
            else {
                category.image = new Buffer(req.body.ImageDisplay, 'base64');
            }

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
catalogrouter.post('/delete-category', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var isStoreOwner = await security.isStoreOwner(accessToken);

        if (isStoreOwner === false) {
            common.sendUnauthorizedRequest(res);
        }
        else {
            var storeId = await storeService.getStoreIdByAccessToken(accessToken);
            var cateId = await security.decrypt(req.body.Id);

            var category = {
                storeId: storeId,
                id: cateId
            };
            var result = await service.deactivateCategory(category);

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

//get category list in store
catalogrouter.post('/category-list', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var storeId = await storeService.getStoreIdByAccessToken(accessToken);

        var result = await service.getCategoryInStore(storeId);

        var message = common.createResponseMessage(result.model.category,
            result.model.responsecode,
            result.model.statusmessage);

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));      
    }
    catch (err) {
        next(err);
    }
});

//create product
catalogrouter.post('/create-product', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var isStoreOwner = await security.isStoreOwner(accessToken);

        if (isStoreOwner === false) {
            common.sendUnauthorizedRequest(res);
        }
        else {
            var storeId = await storeService.getStoreIdByAccessToken(accessToken);
            var product = {
                storeId: storeId,
                name: req.body.Name,
                description: req.body.Description,
                categoryId: security.decrypt(req.body.CategoryId),
                price: req.body.Price,
                image: null
            };

            if (req.body.ImageDisplay === null || req.body.ImageDisplay === '' || req.body.ImageDisplay === undefined) {
                product.image = io.readFileToBinary('./resources/images/default-product.png');
            }
            else {
                product.image = new Buffer(req.body.ImageDisplay, 'base64');
            }

            var result = await service.createProduct(product);

            var message = common.createResponseMessage(result.model.product,
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

//update product
catalogrouter.post('/update-product', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var isStoreOwner = await security.isStoreOwner(accessToken);

        if (isStoreOwner === false) {
            common.sendUnauthorizedRequest(res);
        }
        else {
            var storeId = await storeService.getStoreIdByAccessToken(accessToken);
            var productId = await security.decrypt(req.body.Id);
            var cateId = await security.decrypt(req.body.CategoryId);

            var product = {
                storeId: storeId,
                name: req.body.Name,
                description: req.body.Description,
                categoryId: cateId,
                price: req.body.Price,
                id: productId,
                image: null
            };

            if (req.body.ImageDisplay === null || req.body.ImageDisplay === '' || req.body.ImageDisplay === undefined) {
                product.image = io.readFileToBinary('./resources/images/default-product.png');
            }
            else {
                product.image = new Buffer(req.body.ImageDisplay, 'base64');
            }
            var result = await service.updateProduct(product);

            var message = common.createResponseMessage(result.model.product,
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


//deactive product
catalogrouter.post('/delete-product', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var isStoreOwner = await security.isStoreOwner(accessToken);

        if (isStoreOwner === false) {
            common.sendUnauthorizedRequest(res);
        }
        else {
            var storeId = await storeService.getStoreIdByAccessToken(accessToken);
            var productId = await security.decrypt(req.body.Id);

            var product = {
                storeId: storeId,
                id: productId
            };

            var result = await service.deactivateProduct(product);

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

//get product list in store
catalogrouter.post('/product-list', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var storeId = await storeService.getStoreIdByAccessToken(accessToken);

        var result = await service.getProductsInStore(storeId);

        var message = common.createResponseMessage(result.model.product,
            result.model.responsecode,
            result.model.statusmessage);

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
    }
    catch (err) {
        next(err);
    }
});

//get product list in store by cate
catalogrouter.post('/product-list-by-cate', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var storeId = await storeService.getStoreIdByAccessToken(accessToken);
        var cateId = await security.decrypt(req.body.CategoryId);

        var product = {
            storeId: storeId,
            categoryId: cateId
        };

        var result = await service.getProductsInStoreByCate(product);

        var message = common.createResponseMessage(result.model.product,
            result.model.responsecode,
            result.model.statusmessage);

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
    }
    catch (err) {
        next(err);
    }
});

module.exports = catalogrouter;