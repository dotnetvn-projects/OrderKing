const { poolPromise, sql } = require('../database/dbconnection');
const moment = require('moment');
const reponse = require('../models/auth/auth-response');
const status = require('../resources/response-status');
const security = require('../services/securityservice');
const query = require('../database/authquery');
const sessionLoginHandler = require('../eventHandlers/session-login-handler');

//remove authentication from request of client
exports.removeAuth = async function (accessToken) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('AccessToken', sql.NVarChar, accessToken)
        .query(query.queryLoginSession);

    if (result.recordset.length > 0) {
        reponse.model.expireddate = moment().format('DD/MM/YYYY HH:mm:ss');
        reponse.model.accesstoken = accessToken;
        reponse.model.statusmessage = status.authen.removesuccess;
        reponse.model.responsecode = status.authen.removesuccesscode;
    }
    else {
        reponse.model.statusmessage = status.authen.removefailed;
        reponse.model.responsecode = status.authen.removefailedcode;
    }
    return authreponse;
};

//executing authentication for client and create access token
exports.executeAuth = async function (accountName, password, ip, userAgent, referrer) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('AccountName', sql.NVarChar, accountName)
        .input('Password', sql.NVarChar, password)
        .query(query.getHashKey);

    if (result.recordset.length > 0) {
        var accessToken = security.generateHash(result.recordset[0].HashKey);
        var expireddate = moment().add(24, 'h');
        reponse.model.accesstoken = accessToken;
        reponse.model.expireddate = expireddate.format('DD/MM/YYYY HH:mm:ss');
        reponse.model.statusmessage = status.authen.suscess;
        reponse.model.responsecode = status.authen.suscesscode;

        sessionLoginHandler.fire(accountName, ip, userAgent, referrer, accessToken, expireddate)
    }
    else {
        reponse.model.statusmessage = status.authen.failed;
        reponse.model.responsecode = status.authen.failedcode;
    }
    return authreponse;
};