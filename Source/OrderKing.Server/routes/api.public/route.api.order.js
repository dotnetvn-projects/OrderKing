const express = require('express');
const service = require('../../services/service.order');
const storeService = require('../../services/service.store');
const common = require('../../common/common');
const orderrouter = express.Router();

orderrouter.post('/get-order-list', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var storeId = await storeService.getStoreIdByAccessToken(accessToken);

        if (storeId === -1) {
            common.sendBadRequest(res, 'Request data is invalid !');
        }
        else {

            var result = await service.getOrderListByStore(storeId);
            var orders = [];
            if (result.model.orderinfo.length > 0) {
                result.model.orderinfo.forEach(function (value) {
                    orders.push({
                        storename: value.StoreName,
                        ordercode: value.OrderCode,
                        seqnum: value.SeqNum,
                        totalprice: value.TotalPrice,
                        amount: value.TotalAmount,
                        createddate: value.CreatedDate,
                        printeddate: value.PrintedDate,
                        orderstatus: value.OrderStatus,
                        selleraccount: value.SellerAccount,
                        seller: value.Seller
                    });
                });
            }

            var message = common.createResponseMessage(orders,
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
        var storeId = await storeService.getStoreIdByAccessToken(accessToken);

        if (storeId === -1) {
            common.sendBadRequest(res, 'Request data is invalid !');
        }
        else {

            var result = await service.getOrderListByStore(storeId);
            var orders = [];
            if (result.model.orderinfo.length > 0) {
                result.model.orderinfo.forEach(function (value) {
                    orders.push({
                        storename: value.StoreName,
                        ordercode: value.OrderCode,
                        seqnum: value.SeqNum,
                        totalprice: value.TotalPrice,
                        amount: value.TotalAmount,
                        createddate: value.CreatedDate,
                        printeddate: value.PrintedDate,
                        orderstatus: value.OrderStatus,
                        selleraccount: value.SellerAccount,
                        seller: value.Seller
                    });
                });
            }

            var message = common.createResponseMessage(orders,
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

module.exports = orderrouter;