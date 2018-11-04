const { poolPromise, sql } = require('../database/dbconnection');
const moment = require('moment');
const reponse = require('../models/auth/auth-response');
const status = require('../resources/response-status');
const security = require('../services/securityservice');
const authenSqlCmd = require('../database/auth-sqlcommand');
const sessionLoginHandler = require('../eventHandlers/session-login-handler');

//remove authentication from request of client
exports.removeAuth = async function (accessToken) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('AccessToken', sql.NVarChar, accessToken)
        .query(authenSqlCmd.queryLoginSession);

    if (result.recordset.length > 0) {
        var current = moment().format('DD/MM/YYYY HH:mm:ss');
        if (result.recordset[0].IsExpired === true) {
            current = moment(result.recordset[0].AccessTokenExpired).format('DD/MM/YYYY HH:mm:ss');
        }
        else {
            //make session login expired
            sessionLoginHandler.fire('makeExpired', accessToken);
        }
        reponse.model.expireddate = current;
        reponse.model.accesstoken = accessToken;
        reponse.model.statusmessage = status.common.suscess;
        reponse.model.responsecode = status.common.suscesscode;      
    }
    else {
        reponse.model.statusmessage = status.common.failed;
        reponse.model.responsecode = status.common.failedCode;
    }

    return reponse;
};

//executing authentication for client and create access token
exports.executeAuth = async function (accountName, password, ip, userAgent, referrer) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('AccountName', sql.NVarChar, accountName)
        .input('Password', sql.NVarChar, password)
        .query(authenSqlCmd.getHashKey);

    if (result.recordset.length > 0) {
        var accessToken = security.generateHash(result.recordset[0].AccountName +'-'+ result.recordset[0].HashKey);
        var expireddate = moment().add(24, 'h');
        reponse.model.accesstoken = accessToken;
        reponse.model.expireddate = expireddate.format('DD/MM/YYYY HH:mm:ss');
        reponse.model.statusmessage = status.common.suscess;
        reponse.model.responsecode = status.common.suscesscode;

        sessionLoginHandler.fire('insert', result.recordset[0].Id, ip, userAgent,
            referrer, accessToken, expireddate);
    }
    else {
        reponse.model.statusmessage = status.common.failed;
        reponse.model.responsecode = status.common.failedcode;
    }
    return reponse;
};