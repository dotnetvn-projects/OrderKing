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
        var reportData = {
            storeId: storeId,
            pageSize: req.body.PageSize,
            pageNumber: req.body.PageNumber
        };
        var result = await service.getProductListSoldInDay(reportData);

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

// get monthly revenue report in year
reportrouter.post('/get-monthly-revenue-year', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;

        var storeId = await storeService.getStoreIdByAccessToken(accessToken);

        var reportData = {
            year: req.body.Year,
            storeId: storeId
        };

        var result = await service.getMonthRevenueInYear(reportData);

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

// get revenue report
reportrouter.post('/get-revenue-report', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;

        var storeId = await storeService.getStoreIdByAccessToken(accessToken);

        var reportData = {
            storeId: storeId
        };

        var result = await service.getRevenueReport(reportData);

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

// get sale report by date range
reportrouter.post('/get-sale-report-date-range', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;

        var storeId = await storeService.getStoreIdByAccessToken(accessToken);

        var reportData = {
            storeId: storeId,
            startDate: req.body.StartDate,
            endDate: req.body.EndDate,
            pageSize: req.body.PageSize,
            pageNumber: req.body.PageNumber
        };

        var result = await service.getSaleReportWithDateRagne(reportData);

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

// get product sold report by date range
reportrouter.post('/get-product-sold-report-date-range', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;

        var storeId = await storeService.getStoreIdByAccessToken(accessToken);

        var reportData = {
            storeId: storeId,
            startDate: req.body.StartDate,
            endDate: req.body.EndDate,
            pageSize: req.body.PageSize,
            pageNumber: req.body.PageNumber
        };

        var result = await service.getProductSoldReportWithDateRagne(reportData);

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

// get prouduct best selling list
reportrouter.post('/get-product-best-sell', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;

        var storeId = await storeService.getStoreIdByAccessToken(accessToken);

        var reportData = {
            storeId: storeId,
            top: req.body.Top,
            type: req.body.Type
        };

        var result = await service.getTopBestSelling(reportData);

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