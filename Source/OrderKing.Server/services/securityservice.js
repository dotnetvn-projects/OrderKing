var crypto = require('crypto');
var fs = require('fs');

//create hash key
function createHash (data) {
    //get server key
    var key = fs.readFileSync('./resources/serverkey.txt', 'utf8');

    //create hash with serverkey
    var input = data + key;
    return crypto.createHash('sha512').update(input).digest("hex");
}

function isValidRequest(req) {
    var isvalid = true;
    var referrer = req.headers.referer;
    var apikey = req.headers.apikey;
    if (apikey !== undefined && referrer !== undefined) {
        var t = 'a';
    }

    return isvalid;
}

exports.createHash = createHash;
exports.isValidRequest = isValidRequest;