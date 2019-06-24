const express = require('express');
const sysNotifyRouter = express.Router();
const service = require('../../services/service.sysnotify');
const userService = require('../../services/service.user');
const security = require('../../services/service.security');
const common = require('../../common/common');
const status = require('../../resources/resource.api.status');

//get newest notify list
sysNotifyRouter.post('/get-newest-notify-list', async (req, res, next) => {
    try {

        var accountId = await userService.getAccountIdByAccessToken(req.body.AccessToken);

        var data = {
            accountId: accountId
        };

        var result = await service.getNewestSysNotifyList(data);

        var message = common.createResponseMessage(result.model.notify,
            result.model.responsecode,
            result.model.statusmessage);

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
    }
    catch (err) {
        next(err);
    }
});

//get notify list
sysNotifyRouter.post('/get-notify-list', async (req, res, next) => {
    try {
        var accountId = await userService.getAccountIdByAccessToken(req.body.AccessToken);
        var data = {
            accountId: accountId,
            pageSize: req.body.PageSize,
            pageNumber: req.body.PageNumber
        };

        var result = await service.getSysNotifyList(data);

        var message = common.createResponseMessage(result.model.notify,
            result.model.responsecode,
            result.model.statusmessage);

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
    }
    catch (err) {
        next(err);
    }
});

//get notify detail
sysNotifyRouter.post('/get-notify-detail', async (req, res, next) => {
    try {      
        
        var data = {
            id: security.decrypt(req.body.Id).split('_')[0]
        };

        var result = await service.getSysNotifyDetail(data);

        if (result.model.responsecode === status.common.suscesscode) {
            var accountId = await userService.getAccountIdByAccessToken(req.body.AccessToken);
            await service.updateHasReadSysNotify({
                sysNotifyId: data.id,
                accountId: accountId,
                hasRead: 1
            });
        }

        var message = common.createResponseMessage(result.model.notify,
            result.model.responsecode,
            result.model.statusmessage);

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
    }
    catch (err) {
        next(err);
    }
});

//update HasRead value of notify item
sysNotifyRouter.post('/update-notify-hasread', async (req, res, next) => {
    try {

        var data = {
            sysNotifyId: security.decrypt(req.body.Id).split('_')[0],
            accountId: userService.getAccountIdByAccessToken(req.body.AccessToken),
            hasRead: req.body.HasRead
        };

        var result = await service.updateHasReadSysNotify(data);

        var message = common.createResponseMessage(result.model.notify,
            result.model.responsecode,
            result.model.statusmessage);

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
    }
    catch (err) {
        next(err);
    }
});

//update HasRead value of notify items for every single account
sysNotifyRouter.post('/update-notify-hasread', async (req, res, next) => {
    try {

        var data = {
            accountId: userService.getAccountIdByAccessToken(req.body.AccessToken),
            hasRead: req.body.HasRead
        };

        var result = await service.updateHasReadSysNotifyForAccount(data);

        var message = common.createResponseMessage(result.model.notify,
            result.model.responsecode,
            result.model.statusmessage);

        res.writeHead(result.model.responsecode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
    }
    catch (err) {
        next(err);
    }
});



module.exports = sysNotifyRouter;