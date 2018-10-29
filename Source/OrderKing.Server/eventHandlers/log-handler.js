var events = require('events');
var logger = require('../services/logservice');

var eventEmitter = new events.EventEmitter();

eventEmitter.on('info', (arg) => {
    logger.info(arg);
});

eventEmitter.on('error', (arg) => {
    logger.error(arg);
});

eventEmitter.on('debug', (arg) => {
    logger.debug(arg);
});

var fireLog = function (logType, message) {
    eventEmitter.emit(logType, message);
};

exports.fire = fireLog;