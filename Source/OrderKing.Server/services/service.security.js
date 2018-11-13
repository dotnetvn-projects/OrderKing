var crypto = require('../common/crypto');

//create hash
function generateHash(data) {
    return crypto.generateHash(data);
}

//encrypt data
function encrypt(data) {
    return crypto.encrypt(data);
}

//decrypt data
function decrypt(data) {
    return crypto.decrypt(data);
}

exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.generateHash = generateHash;

