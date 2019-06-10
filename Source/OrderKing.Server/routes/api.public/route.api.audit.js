const express = require('express');
const auditRouter = express.Router();
const service = require('../../services/service.audit');
const storeService = require('../../services/service.store');
const security = require('../../services/service.security');
const common = require('../../common/common');

auditRouter.post('/get-audit', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var isStoreOwner = await security.isStoreOwner(accessToken);

        if (isStoreOwner === false) {
            common.sendUnauthorizedRequest(res);
        }
        else {
            var storeId = await storeService.getStoreIdByAccessToken(accessToken);
            var auditData = {
                storeId: storeId,
                pageSize: req.body.PageSize,
                pageNumber: req.body.PageNumber,
                startDate: req.body.StartDate,
                endDate: req.body.EndDate,
                accessToken: accessToken
            };

            var result = await service.getAuditList(auditData);

            var message = common.createResponseMessage(result.model.audit,
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

auditRouter.post('/delete-audit', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var isStoreOwner = await security.isStoreOwner(accessToken);

        if (isStoreOwner === false) {
            common.sendUnauthorizedRequest(res);
        }
        else {
            var storeId = await storeService.getStoreIdByAccessToken(accessToken);
            var auditData = {
                storeId: storeId,
                auditId: req.body.AuditId,
                accessToken: accessToken
            };

            var result = await service.deleteAudit(auditData);

            var message = common.createResponseMessage(result.model.audit,
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

module.exports = auditRouter;