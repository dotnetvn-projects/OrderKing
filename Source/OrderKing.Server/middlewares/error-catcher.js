const common = require('../common/common');

var exceptionMiddleware = function (err, req, res, next) {
    var ip = req.connection.remoteAddress;
    logHandler.fire('error', format('there is an error occurred while executing authentication for ip [{0}]', ip));
    logHandler.fire('error', err);
    common.sendBadRequest(res);
    next();
};

exports.setmiddleware = exceptionMiddleware;