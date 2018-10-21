const { poolPromise, sql } = require('../database/dbconnection');

function generateAccessToken(user, pass) {

}

exports.executeAuth = async function () {
    const pool = await poolPromise;
    const result = await pool.request()
        .query('select * from Account');
    return result.recordset;
};