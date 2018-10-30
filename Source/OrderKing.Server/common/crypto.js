var crypto = require('crypto');
const moment = require('moment');
const apiConfig = require('../resources/api-config');
const algorithm = 'aes-256-ctr';
const password = apiConfig.server.serverkey;

exports.generateHash = function (data) {
    var input = data + password + moment().format('YYYY-MM-DD HH:mm:ss:fff');
    return crypto.createHash('sha512').update(input).digest("hex");
}

exports.encrypt = function (data) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(data, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

exports.decrypt = function (data) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(data, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}