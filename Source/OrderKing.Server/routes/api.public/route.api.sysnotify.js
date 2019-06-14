const express = require('express');
const sysNotifyRouter = express.Router();
const service = require('../../services/service.sysnotify');
const security = require('../../services/service.security');
const common = require('../../common/common');
const resources = require('../../resources/resource.api.value');

//get newest notify list
sysNotifyRouter.post('/get-newest-notify-list', async (req, res, next) => {
    try {
        var result = await service.getNewestSysNotifyList();

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
        var result = await service.getSysNotifyList();

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