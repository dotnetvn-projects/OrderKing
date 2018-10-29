const { poolPromise, sql } = require('../database/dbconnection');
const moment = require('moment');
const authreponse = require('../models/auth/auth-response');
const responestatus = require('../resources/response-status');
const security = require('../services/securityservice');
const query = require('../database/authquery');


exports.removeAuth = async function (accessToken) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('@AccessToken', sql.NVarChar, accessToken)
        .query(query.queryLoginSession);

    if (result.recordset.length > 0) {
        authreponse.model.StatusMessage = 'Removed';
        authreponse.model.ExpiredDate = moment().format('dd/MM/yyyy HH:mm:ss');
        authreponse.model.AccessToken = 'accessToken';
    }
    return authreponse;
};

exports.executeAuth = async function (accountName, password) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('AccountName', sql.NVarChar, accountName)
        .input('Password', sql.NVarChar, password)
        .query(query.getHashKey);

    if (result.recordset.length > 0) {
        var accessToken = security.createHash(result.recordset[0].HashKey);
        var now = moment().add(24, 'h');
        authreponse.model.AccessToken = accessToken;
        authreponse.model.ExpiredDate = now.format('DD/MM/YYYY HH:mm:ss');
        authreponse.model.StatusMessage = responestatus.authen.Suscess;
        authreponse.model.ResponseCode = responestatus.authen.SuscessCode;
    }
    else {
        authreponse.model.StatusMessage = responestatus.authen.Failed;
        authreponse.model.ResponseCode = responestatus.authen.FailedCode;
    }
    return authreponse;
};