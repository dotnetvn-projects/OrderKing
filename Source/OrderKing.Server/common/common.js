const status = require('../resources/resource.api.status');
const crypto = require('../common/crypto');


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
    res.writeHead(status.invalidRequest.code, { 'Content-Type': 'application/json' });
    var message = { responsecode: 0, statusmessage: '', result: null };
    message.responsecode = status.invalidRequest.code;
    message.statusmessage = status.invalidRequest.message;
    message.result = null;
    res.end(JSON.stringify(message));
};

//send bad request
exports.sendBadRequest = function sendBadRequest(res) {
    res.writeHead(status.badRequest.code, { 'Content-Type': 'application/json' });
    var message = { responsecode: 0, statusmessage: '', result: null };
    message.responsecode = status.badRequest.code;
    message.statusmessage = status.badRequest.message;
    message.result = null;
    res.end(JSON.stringify(message));
};

//send unauthorized request
exports.sendUnauthorizedRequest = function sendUnauthorizedRequest(res) {
    res.writeHead(status.unauthorizedRequest.code,
        { 'Content-Type': 'application/json' });

    var message = { responsecode: 0, statusmessage: '', result: null };
    message.responsecode = status.unauthorizedRequest.code;
    message.statusmessage = status.unauthorizedRequest.message;
    message.result = null;
    res.end(JSON.stringify(message));
};

//send token expired
exports.sendTokenExpired = function sendTokenExpired(res) {
    res.writeHead(status.tokenExpired.code,
        { 'Content-Type': 'application/json' });

    var message = { responsecode: 0, statusmessage: '', result: null };
    message.responsecode = status.tokenExpired.code;
    message.statusmessage = status.tokenExpired.message;
    message.result = null;
    res.end(JSON.stringify(message));
};

