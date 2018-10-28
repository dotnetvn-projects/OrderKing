var crypto = require('crypto');
var fs = require('fs');

function createHash (data) {
    //get serverkey config
    var key = fs.readFileSync('./resources/serverkey.txt', 'utf8');
    //create hash
    var input = data + key;
    return crypto.createHash('sha512').update(input).digest("hex");
}

exports.createHash = createHash;