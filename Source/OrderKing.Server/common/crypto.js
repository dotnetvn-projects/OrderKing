var crypto = require('crypto');
const moment = require('moment');
const apiConfig = require('../resources/resource.api.config');
const algorithm = 'aes-256-ctr';
const password = apiConfig.server.serverkey;

exports.generateHash = function (data) {
    var input = data + '-' + moment().format('YYYY-MM-DD HH:mm:ss:fff');
    var cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(input, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};

exports.encrypt = function (data) {
    var cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};

exports.decrypt = function (data) {
    var decipher = crypto.createDecipher(algorithm, password);
    var dec = decipher.update(data, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
};