const common = require('../common/common');
const moment = require('moment');
const format = require('string-format');
const logHandler = require('../eventHandlers/log-handler');
const { poolPromise, sql } = require('../database/dbconnection');
const apiConfig = require('../resources/api-config');
const authenSqlCmd = require('../database/auth-sqlcommand');
const sessionLoginHandler = require('../eventHandlers/session-login-handler');

function isAcceptedRequest(req) {
    var isvalid = false;
    var referrer = req.headers.referer;
    var apikey = req.headers.apikey;

    if (apikey === apiConfig.seller.apikey && referrer === apiConfig.seller.referrer
        || apikey === apiConfig.manager.apikey && referrer === apiConfig.manager.referrer
        || apikey === apiConfig.system.apikey && referrer === apiConfig.system.referrer) {
        isvalid = true;
    }
    return isvalid;
}

var validateRequest = async function (req, res, next) {
    try {
        var ip = req.connection.remoteAddress;
        var isAccepted = isAcceptedRequest(req);
        if (isAccepted === false) {
            logHandler.fire('error', format('ip [{0}] {1} ', ip, 'has been rejected by server'));
            common.sendUnauthorizedRequest(res);
        }
        else {
            var valid = true;
            var accessToken = req.body.AccessToken;
            if (req.url.indexOf('auth-user') === -1) {
                if (accessToken === undefined || accessToken === '') {
                    logHandler.fire('error', format('ip [{0}] {1} ', ip, 'has sent a request without accesstoken'));
                    common.sendInvalidRequest(res);
                    valid = false;
                }
                else {
                    const pool = await poolPromise;
                    const result = await pool.request()
                        .input('AccessToken', sql.NVarChar, accessToken)
                        .query(authenSqlCmd.queryLoginSession);

                    var tokenInfo = common.parseTokenInfo(accessToken);
                    var accountName = result.recordset[0].AccountName;

                    if (result.recordset.length <=0 || tokenInfo.account !== accountName) {
                        logHandler.fire('error', format('ip [{0}] {1} ', ip, 'has sent the request with fake accesstoken'));
                        common.sendBadRequest(res);
                    }
                    else {
                        //check token expired
                        var current = moment();
                        var expiredDate = moment(result.recordset[0].AccessTokenExpired);
                        if (current > expiredDate) {
                            logHandler.fire('error', format('ip [{0}] {1} ', ip, 'has sent the request with a accesstoken is expired'));
                            //make session login expired
                            sessionLoginHandler.fire('makeExpired', accessToken);
                            valid = false;
                            common.sendTokenExpired(res);
                        }
                        else {
                            sessionLoginHandler.fire('updateLastAccessTime', accessToken);
                        }
                    }
                }
            }
            if (valid)
                next();
        }
    } catch (error) {
        next(error);
    }
};

exports.setmiddleware = validateRequest;