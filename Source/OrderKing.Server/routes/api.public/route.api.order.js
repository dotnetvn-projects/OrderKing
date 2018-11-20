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
    catch (err) {
        next(err);
    }
});


module.exports = orderrouter;