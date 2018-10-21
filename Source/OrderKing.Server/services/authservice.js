const { poolPromise, sql } = require('../database/dbconnection');

const queryUser = 'SELECT HashKey FROM Account';

function createAccessToken(user, pass) {

}

exports.executeAuth = async function (accountName, password) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('AccountName', sql.NVarChar, accountName)
        .input('Password', sql.NVarChar, password)
        .query(queryUser);
    return result.recordset;
};