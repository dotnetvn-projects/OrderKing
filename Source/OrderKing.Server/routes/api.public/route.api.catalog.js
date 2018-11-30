const express = require('express');
const catalogrouter = express.Router();
const service = require('../../services/service.catalog');
const storeService = require('../../services/service.store');
const security = require('../../services/service.security');
const common = require('../../common/common');
const io = require('../../common/io');
const imageProcess = require('../../common/image.process');
const resources = require('../../resources/resource.api.value');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

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

            category.image = io.readFileToBinary('./resources/images/no-image.png');
            
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

//update category image
catalogrouter.post('/change-category-image', multipartMiddleware, async (req, res, next) => {
    try {
        var accessToken = req.body.null[0];
        var categoryId = security.decrypt(req.body.null[1]);
        var storeId = await service.getStoreIdByAccessToken(accessToken);

        var buff = io.readFileToBinary(req.files.null.path);

        imageProcess.resizeAutoScaleHeight(buff, resources.categorySize.W, async (imageData) => {
            var result = await service.updateCatagoryImage({
                image: imageData,
                id: categoryId,
                storeId: storeId
            });

            io.deleteFile(req.files.null.path);

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
                id: cateId
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

            product.image = io.readFileToBinary('./resources/images/default-product.png');            

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
                id: productId
            };

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

//update product image
catalogrouter.post('/change-product-image', multipartMiddleware, async (req, res, next) => {
    try {
        var accessToken = req.body.null[0];
        var productId = security.decrypt(req.body.null[1]);
        var storeId = await service.getStoreIdByAccessToken(accessToken);

        var buff = io.readFileToBinary(req.files.null.path);

        imageProcess.resizeAutoScaleHeight(buff, resources.productSize.W, async (imageData) => {
            var result = await service.updateProductImage({
                image: imageData,
                id: productId,
                storeId: storeId
            });

            io.deleteFile(req.files.null.path);

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

//get product image
catalogrouter.post('/product-img', async (req, res, next) => {
    try {
        var productId = security.decrypt(req.query.pid);

        var result = await service.getProductImage(productId);
        var img = new Buffer(result.model.product);

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

//get category image
catalogrouter.post('/cate-img', async (req, res, next) => {
    try {
        var categoryId = security.decrypt(req.query.cid);

        var result = await service.getCategoryImage(categoryId);
        var img = new Buffer(result.model.category);

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

module.exports = catalogrouter;