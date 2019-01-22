const express = require('express');
const paymentrouter = express.Router();
const service = require('../../services/service.payment');
const common = require('../../common/common');
const status = require('../../resources/resource.api.status');
const format = require('string-format');
const security = require('../../services/service.security');
const io = require('../../common/io');
const resources = require('../../resources/resource.api.value');
const imageProcess = require('../../common/image.process');
const moment = require('moment');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

//load payment methods
paymentrouter.post('/get-paymentmethod-list', async (req, res, next) => {
    try {
        var accessToken = req.body.AccessToken;
        var isStoreOwner = await security.isStoreOwner(accessToken);

        if (isStoreOwner === false) {
            common.sendUnauthorizedRequest(res);
        }
        else {

            var result = await service.getPaymentMethods();
            var message = common.createResponseMessage(result.model.paymentmethod,
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

module.exports = paymentrouter;