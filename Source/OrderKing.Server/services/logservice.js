var winston = require('winston');
var moment = require('moment');
require('winston-daily-rotate-file');

var transport = new winston.transports.DailyRotateFile({
    filename: 'logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});

var debugTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/debug/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});


transport.on('rotate', function (oldFilename, newFilename) {
    // do something fun
});


var logger = winston.createLogger({
    format: winston.format.printf(info => moment().format('YYYY-MM-DD HH:mm:ss') + ' [' + info.level.toUpperCase() + ']: ' + info.message),
    transports: [
        transport
    ]
});

var debugLogger = winston.createLogger({
    format: winston.format.printf(info => moment().format('YYYY-MM-DD HH:mm:ss') + ' [DEBUG]: ' + info.message),
    transports: [
        debugTransport
    ]
});

exports.info = function (message) {
    logger.info(message);
};

exports.error = function (message) {
    logger.error(message);
};

exports.debug = function (message) {
    debugLogger.info(message);
};
