var crypto = require('../common/crypto');
const storeSqlCmd = require('../database/sqlcommand.store');
const { poolPromise, sql } = require('../database/dbconnection');

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

//check current access token has store owner right or not
async function isStoreOwner(accessToken) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('AccessToken', sql.NVarChar, accessToken)
        .query(storeSqlCmd.getStoreOwnerId);

    return result.recordset.length > 0;
}

exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.generateHash = generateHash;
exports.isStoreOwner = isStoreOwner;

