const express = require('express');
const service = require('../../services/service.order');
const storeService = require('../../services/service.store');
const userService = require('../../services/service.user');
const common = require('../../common/common');
const security = require('../../services/service.security');
const orderrouter = express.Router();

//get order list
orderrouter.post('/get-order-list', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var isStoreOwner = await security.isStoreOwner(accessToken);

        if (isStoreOwner === false) {
            common.sendUnauthorizedRequest(res);
        }
        else {
            var storeId = await storeService.getStoreIdByAccessToken(accessToken);

            if (storeId === -1) {
                common.sendBadRequest(res, 'Request data is invalid !');
            }
            else {

                var result = await service.getOrderListByStore(storeId);

                var message = common.createResponseMessage(result.model.orderinfo,
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

//get orders of seller
orderrouter.post('/get-seller-order', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var sellerId = await userService.getAccountIdByAccessToken(accessToken);

        var storeId = await storeService.getStoreIdByAccessToken(accessToken);

        if (storeId === -1 || sellerId === -1) {
            common.sendBadRequest(res, 'Request data is invalid !');
        }
        else {

            var result = await service.getOrderListBySellerId(sellerId);

            var message = common.createResponseMessage(result.model.orderinfo,
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

//search order; from date to date, order code, seller, status
//order by: created date
orderrouter.post('/search-order', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var isStoreOwner = await security.isStoreOwner(accessToken);

        if (isStoreOwner === false) {
            common.sendUnauthorizedRequest(res);
        }
        else {
            var storeId = await storeService.getStoreIdByAccessToken(accessToken);

            if (storeId === -1) {
                common.sendBadRequest(res, 'Request data is invalid !');
            }
            else {
                var searchInfo = {
                    storeid: storeid,
                    ordercode: req.body.OrderCode,
                    startdate: req.body.StartDate,
                    enddate: req.body.EndDate,
                    status: req.body.OrderStatus,
                    seller: req.body.Seller
                };

                var result = await service.searchOrderListByStore(searchInfo);

                var message = common.createResponseMessage(result.model.orderinfo,
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

//create order
orderrouter.post('/create-new', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var storeId = await storeService.getStoreIdByAccessToken(accessToken);
        var sellerId = await userService.getAccountIdByAccessToken(accessToken);

        if (storeId === -1 || sellerId === -1) {
            common.sendBadRequest(res, 'Request data is invalid !');
        }
        else {
            var orderInfo = {
                storeid: storeid,
                seqnum: req.body.SeqNumber,
                sellerid: sellerId,
                amount: req.body.TotalAmount,
                price: req.body.TotalPrice
            };

            var detailData = req.body.OrderDetail;

            var result = await service.createNewOrder(orderInfo);

            if (result.model.orderinfo !== null) {
                for (var orderDetail in detailData) {
                    var detail = {
                        orderId: result.model.orderinfo.orderid,
                        productid: security.decrypt(orderDetail.ProductId),
                        amount: req.body.Amount,
                        price: req.body.Price
                    };

                    await service.createOrderDetail(detail);
                }

                result.model.orderinfo.orderid = security.encrypt(result.model.orderinfo.orderid);
            }

            var message = common.createResponseMessage(result.model.orderinfo,
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

//update order status
orderrouter.post('/update-status', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var storeId = await storeService.getStoreIdByAccessToken(accessToken);
        var orderId = security.decrypt(req.body.OrderId);
        var status = req.body.OrderStatus;

        var result = await service.updateOrderStatus({
            storeid: storeId,
            orderid: orderId,
            orderstatus: status
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

//get order order
orderrouter.post('/get-info', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var storeId = await storeService.getStoreIdByAccessToken(accessToken);
        var orderId = security.decrypt(req.body.OrderId);

        var result = await service.getOrderInfo({
            storeid: storeId,
            orderid: orderId
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


module.exports = orderrouter;