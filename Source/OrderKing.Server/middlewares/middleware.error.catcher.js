const common = require('../common/common');
const logHandler = require('../eventHandlers/event.handler.log');
const format = require('string-format');

var exceptionMiddleware = function (err, req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    logHandler.fire('error', format('there is an error occurred while processing request from ip [{0}] to {1}', ip, req.url));
    logHandler.fire('error', err);
    console.log(err);
    common.sendBadRequest(res, err.message);
    next();
};

exports.setmiddleware = exceptionMiddleware;