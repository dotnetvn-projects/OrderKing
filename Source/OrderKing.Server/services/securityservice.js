var crypto = require('crypto');
var fs = require('fs');
const clientAllow = require('../resources/client-allow');

//create hash key
function createHash (data) {
    //get server key
    var key = fs.readFileSync('./resources/serverkey.txt', 'utf8');

    //create hash with serverkey
    var input = data + key;
    return crypto.createHash('sha512').update(input).digest("hex");
}

function isValidRequest(req) {
    var isvalid = false;
    var referrer = req.headers.referer;
    var apikey = req.headers.apikey;
    if (apikey === clientAllow.seller.ApiKey && referrer === clientAllow.seller.Referrer
        || apikey === clientAllow.manager.ApiKey && referrer === clientAllow.manager.Referrer
        || apikey === clientAllow.system.ApiKey && referrer === clientAllow.system.Referrer) {
        isvalid = true;
    }

    return isvalid;
}

exports.createHash = createHash;
exports.isValidRequest = isValidRequest;