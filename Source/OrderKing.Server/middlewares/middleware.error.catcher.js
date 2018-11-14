const common = require('../common/common');
const logHandler = require('../eventHandlers/event.handler.log');
const format = require('string-format');

var exceptionMiddleware = function (err, req, res, next) {
    var ip = req.connection.remoteAddress;
    logHandler.fire('error', format('there is an error occurred while processing request from ip [{0}] to {1}', ip, req.url));
    logHandler.fire('error', err);
    common.sendBadRequest(res);
    next(err);
};

exports.setmiddleware = exceptionMiddleware;