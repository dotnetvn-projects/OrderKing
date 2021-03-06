const { poolPromise, sql } = require('../database/dbconnection');
const moment = require('moment');
const reponse = require('../models/auth/model.auth');
const status = require('../resources/resource.api.status');
const security = require('../services/service.security');
const authenSqlCmd = require('../database/sqlcommand.auth');
const sessionLoginHandler = require('../eventHandlers/event.handler.sessionlogin');

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

//executing authentication for manager and create access token
exports.executeManageAuth = async function (accountName, password, ip, userAgent, referrer) {
    reponse.model.statusmessage = status.common.failed;
    reponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    var result = await pool.request()
        .input('AccountName', sql.NVarChar, accountName)
        .query(authenSqlCmd.getHashKey);
   
    if (result.recordset.length > 0) {
        if (result.recordset[0].IsActived === true) {
            var hash = result.recordset[0].HashKey;
            password = security.encrypt(accountName + "-" + password + "-" + hash);
            result = await pool.request()
                .input('AccountName', sql.NVarChar, accountName)
                .input('Password', sql.NVarChar, password)
                .query(authenSqlCmd.loginManager);

            if (result.recordset.length > 0) {
                var accessToken = security.generateHash(result.recordset[0].AccountName + '-' + hash);
                var expireddate = moment().add(24, 'h');
                reponse.model.accesstoken = accessToken;
                reponse.model.expireddate = expireddate.format('DD/MM/YYYY HH:mm:ss');
                reponse.model.statusmessage = status.common.suscess;
                reponse.model.responsecode = status.common.suscesscode;

                //create new login session
                sessionLoginHandler.fire('insert', result.recordset[0].Id, ip, userAgent,
                    referrer, accessToken, expireddate);
            }
        }
        else {
            reponse.model.statusmessage = status.unauthorizedRequest.message;
            reponse.model.responsecode = status.unauthorizedRequest.code;
        }
    }
    return reponse;
};

//executing authentication for user and create access token
exports.executeAuth = async function (accountName, password, ip, userAgent, referrer) {
    reponse.model.statusmessage = status.common.failed;
    reponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    var result = await pool.request()
        .input('AccountName', sql.NVarChar, accountName)
        .query(authenSqlCmd.getHashKey);

    if (result.recordset.length > 0) {
        if (result.recordset[0].IsActived === true) {
            var hash = result.recordset[0].HashKey;
            password = security.encrypt(accountName + "-" + password + "-" + hash);
            result = await pool.request()
                .input('AccountName', sql.NVarChar, accountName)
                .input('Password', sql.NVarChar, password)
                .query(authenSqlCmd.login);

            if (result.recordset.length > 0) {
                var accessToken = security.generateHash(result.recordset[0].AccountName + '-' + hash);
                var expireddate = moment().add(24, 'h');
                reponse.model.accesstoken = accessToken;
                reponse.model.expireddate = expireddate.format('DD/MM/YYYY HH:mm:ss');
                reponse.model.statusmessage = status.common.suscess;
                reponse.model.responsecode = status.common.suscesscode;

                //create new login session
                sessionLoginHandler.fire('insert', result.recordset[0].Id, ip, userAgent,
                    referrer, accessToken, expireddate);
            }
        }
        else {
            reponse.model.statusmessage = status.unauthorizedRequest.message;
            reponse.model.responsecode = status.unauthorizedRequest.code;
        }
    }
    return reponse;
};

//check token is expired or not
exports.checkExpiredToken = async function (accessToken) {
    reponse.model.statusmessage = status.common.failed;
    reponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    var result = await pool.request()
        .input('AccessToken', sql.NVarChar, accessToken)
        .query(authenSqlCmd.getTokenExpiration);

    if (result.recordset.length > 0) {
        var current = moment();
        var expiredDate = moment(result.recordset[0].AccessTokenExpired);
        if (current > expiredDate) {
            sessionLoginHandler.fire('makeExpired', result.recordset[0].AccessToken);
        }
        else {
            reponse.model.statusmessage = status.common.suscess;
            reponse.model.responsecode = status.common.suscesscode;
        }
    }
    return reponse;
};

