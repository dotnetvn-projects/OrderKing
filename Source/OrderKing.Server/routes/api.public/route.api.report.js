const express = require('express');
const reportrouter = express.Router();
const storeService = require('../../services/service.store');
const service = require('../../services/service.report');
const security = require('../../services/service.security');
const common = require('../../common/common');

// get summary report
reportrouter.post('/get-summary-report', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;

        var storeId = await storeService.getStoreIdByAccessToken(accessToken);

        var result = await service.getSummaryReport(storeId);

        var message = common.createResponseMessage(result.model.data,
            result.model.responsecode,
            result.model.statusmessage);

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));     
    }
    catch (err) {
        next(err);
    }
});

// get product list sold in day
reportrouter.post('/get-product-sold-daily', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;

        var storeId = await storeService.getStoreIdByAccessToken(accessToken);

        var result = await service.getProductListSoldInDay(storeId);

        var message = common.createResponseMessage(result.model.data,
            result.model.responsecode,
            result.model.statusmessage);

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
    }
    catch (err) {
        next(err);
    }
});

module.exports = reportrouter;