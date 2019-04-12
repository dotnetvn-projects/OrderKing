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

exports.isNumber = function (num) {
    return /^-{0,1}\d+$/.test(num); 
};

exports.extractDateRange = function (startdate, enddate) {
    var start = null;
    var end = null;

    if (startdate !== undefined && startdate !== '' && startdate !== null &&
        enddate !== undefined && enddate !== '' && enddate !== null) {

        var startDay = startdate.split('/')[0];
        var startMonth = startdate.split('/')[1];
        var startYear = startdate.split('/')[2];

        var endDay = enddate.split('/')[0];
        var endMonth = enddate.split('/')[1];
        var endYear = enddate.split('/')[2];

        start = new Date(moment({ year: startYear, month: startMonth - 1, day: startDay }).format('YYYY-MM-DD HH:mm:ss'));
        end = new Date(moment({ year: endYear, month: endMonth - 1, day: endDay }).format('YYYY-MM-DD HH:mm:ss'));

    } else if (startdate !== undefined && startdate !== '' && startdate !== null &&
                enddate === undefined || enddate !== '' || enddate !== null) {
   
        startDay = startdate.split('/')[0];
        startMonth = startdate.split('/')[1];
        startYear = startdate.split('/')[2];

        start = new Date(moment({ year: startYear, month: startMonth - 1, day: startDay }).format('YYYY-MM-DD HH:mm:ss'));

    } else if (enddate !== undefined && enddate !== '' && enddate !== null
                && startdate === undefined || startdate !== '' || startdate !== null) {

        endDay = enddate.split('/')[0];
        endMonth = enddate.split('/')[1];
        endYear = enddate.split('/')[2];

        end = new Date(moment({ year: endYear, month: endMonth - 1, day: endDay }).format('YYYY-MM-DD HH:mm:ss'));
    }

    return {
        startDate: start,
        endDate: end
    };
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
exports.createResponseMessage = (data, statusCode, statusMessage) => {
    var message = response.model;
    message.responsecode = statusCode;
    message.statusmessage = statusMessage;
    message.responsedate = moment().format('DD/MM/YYYY HH:mm:ss');
    message.result = data;
    return message;
};
