const status = require('../resources/resource.api.status');
const crypto = require('../common/crypto');
const response = require('../models/model.response');
const moment = require('moment');


//get user info from accessToken
exports.parseTokenInfo = function (accessToken) {
    var result = { account: '' };
    if (accessToken === '' || accessToken === null)
        return result;

    var tokenInfo = crypto.decrypt(accessToken);
    var userInfo = tokenInfo.split('-');
    result.account = userInfo[0];
    return result;
};

//send invalid request
exports.sendInvalidRequest = function sendInvalidRequest(res) {
    res.status(status.invalidRequest.code);
    res.setHeader('content-type', 'application/json');

    var message = { responsecode: 0, statusmessage: '', result: null };
    message.responsecode = status.invalidRequest.code;
    message.statusmessage = status.invalidRequest.message;
    message.result = null;
    res.end(JSON.stringify(message));
};

//send bad request
exports.sendBadRequest = function sendBadRequest(res, err) {
    res.status(status.badRequest.code);
    res.setHeader('content-type', 'application/json');

    var message = { responsecode: 0, statusmessage: '', result: null };
    message.responsecode = status.badRequest.code;
    message.statusmessage = status.badRequest.message;
    message.result = err;
    res.end(JSON.stringify(message));
};

//send unauthorized request
exports.sendUnauthorizedRequest = function sendUnauthorizedRequest(res) {
    res.status(status.unauthorizedRequest.code);
    res.setHeader('content-type', 'application/json');

    var message = { responsecode: 0, statusmessage: '', result: null };
    message.responsecode = status.unauthorizedRequest.code;
    message.statusmessage = status.unauthorizedRequest.message;
    message.result = null;
    res.end(JSON.stringify(message));
};

//send token expired
exports.sendTokenExpired = function sendTokenExpired(res) {
    res.status(status.tokenExpired.code);
    res.setHeader('content-type', 'application/json');

    var message = { responsecode: 0, statusmessage: '', result: null };
    message.responsecode = status.tokenExpired.code;
    message.statusmessage = status.tokenExpired.message;
    message.result = null;
    res.end(JSON.stringify(message));
};

//create response message for client
exports.createResponseMessage = (data,statusCode, statusMessage) => {
    var message = response.model;
    message.responsecode = statusCode;
    message.statusmessage = statusMessage;
    message.responsedate = moment().format('DD/MM/YYYY HH:mm:ss');
    message.result = data;
    return message;
};
