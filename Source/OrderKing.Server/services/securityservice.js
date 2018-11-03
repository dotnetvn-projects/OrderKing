var crypto = require('../common/crypto');
const apiConfig = require('../resources/api-config');

//create hash
function generateHash(data) {
    return crypto.generateHash(data);
}

//check the incoming request has valid or not
function isValidRequest(req) {
    return true;
    var isvalid = false;
    var referrer = req.headers.referer;
    var apikey = req.headers.apikey;

    if (apikey === apiConfig.seller.apikey && referrer === apiConfig.seller.referrer
        || apikey === apiConfig.manager.apikey && referrer === apiConfig.manager.referrer
        || apikey === apiConfig.system.apikey && referrer === apiConfig.system.referrer) {
        isvalid = true;
    }
    return isvalid;
}

exports.generateHash = generateHash;
exports.isValidRequest = isValidRequest;