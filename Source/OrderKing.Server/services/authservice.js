const { poolPromise, sql } = require('../database/dbconnection');
const moment = require('moment');
const authreponse = require('../models/auth/auth-response');

const queryUser = 'SELECT HashKey FROM Account WHERE AccountName = @AccountName AND Pasword = @Pasword ';
const querySesionLogin = 'SELECT Id FROM SessionLogin WHERE AccessToken = @AccessToken';

function createAccessToken(user, pass) {

}

exports.removeAuth = async function (accessToken) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('@AccessToken', sql.NVarChar, accessToken)
        .query(querySesionLogin);

    if (result.recordset.length > 0) {
        authreponse.model.Status = 'Removed';
        authreponse.model.ExpiredDate = moment().format('dd/MM/yyyy HH:mm:ss');
        authreponse.model.AccessToken = 'accessToken';
    }
    return authreponse;
};

exports.executeAuth = async function (accountName, password) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('@AccountName', sql.NVarChar, accountName)
        .input('@Password', sql.NVarChar, password)
        .query(queryUser);
    if (result.recordset.length > 0) {
        var accessToken = createAccessToken(accountName, password);
        var now = moment().add(24, 'h');
        authreponse.model.AccessToken = accessToken;
        authreponse.model.ExpiredDate = now.format('dd/MM/yyyy HH:mm:ss');
        authreponse.model.Status = 'Successful authentication';
    }
    return authreponse;
};