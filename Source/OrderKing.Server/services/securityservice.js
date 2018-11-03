var crypto = require('../common/crypto');

//create hash
function generateHash(data) {
    return crypto.generateHash(data);
}

exports.generateHash = generateHash;
