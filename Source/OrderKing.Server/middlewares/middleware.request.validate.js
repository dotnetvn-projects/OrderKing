const common = require('../common/common');
const moment = require('moment');
const format = require('string-format');
const logHandler = require('../eventHandlers/event.handler.log');
const { poolPromise, sql } = require('../database/dbconnection');
const apiConfig = require('../resources/resource.api.config');
const authenSqlCmd = require('../database/sqlcommand.auth');
const sessionLoginHandler = require('../eventHandlers/event.handler.sessionlogin');

function allowPassValidate(req) {
    return req.url.indexOf('/') >= 0
        || req.url.indexOf('auth-user') >= 0
        || req.url.indexOf('auth-manager') >= 0
        || req.url.indexOf('product-img') >= 0
        || req.url.indexOf('cate-img') >= 0
        || req.url.indexOf('auth-token-status') >= 0
        || req.url.indexOf('store-logo') >= 0
        || req.url.indexOf('user-avatar') >= 0
        || req.url.indexOf('change-category-image') >= 0
        || req.url.indexOf('change-product-image') >= 0
        || req.url.indexOf('edit-member-avatar') >= 0
        || req.url.indexOf('update-store-logo') >= 0;
}


//filter request
function isAcceptedRequest(req) {
    var isvalid = false;

    if (allowPassValidate(req)) {
        return true;
    }
    var appname = req.headers.appname;
    var apikey = req.headers.apikey;

    if (apikey === apiConfig.seller.apikey && appname === apiConfig.seller.appname
        || apikey === apiConfig.manager.apikey && appname === apiConfig.manager.appname
        || apikey === apiConfig.system.apikey && appname === apiConfig.system.appname) {
        isvalid = true;
    }
    return isvalid;
}

//filter request
var validateRequest = async function (req, res, next) {
    try {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var accountName = '';
        var isAccepted = isAcceptedRequest(req);
        if (isAccepted === false) {
            logHandler.fire('error', format('ip [{0}] {1} ', ip, 'has been rejected by server'));
            common.sendUnauthorizedRequest(res);
        }
        else {
            var valid = true;
            var accessToken = '';
            if (req.method === 'POST') {
                accessToken = req.body.AccessToken;
            }
            else {
                accessToken = req.query.access_token;
            }
            if (allowPassValidate(req) === false) {
                if (accessToken === undefined || accessToken === '') {
                    logHandler.fire('error', format('ip [{0}] {1} ', ip, 'has sent a request without accesstoken'));
                    common.sendUnauthorizedRequest(res);
                    valid = false;
                }
                else {
                    const pool = await poolPromise;
                    const result = await pool.request()
                        .input('AccessToken', sql.NVarChar, accessToken)
                        .query(authenSqlCmd.queryLoginSession);

                    var tokenInfo = common.parseTokenInfo(accessToken);
                    accountName = result.recordset[0].AccountName;

                    if (result.recordset.length <=0 || tokenInfo.account !== accountName) {
                        logHandler.fire('error', format('ip [{0}] {1} ', ip, 'has sent the request with fake accesstoken'));
                        common.sendUnauthorizedRequest(res);
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
                            common.sendUnauthorizedRequest(res);
                        }
                        else {
                            sessionLoginHandler.fire('updateLastAccessTime', accessToken);
                        }
                    }
                }
            }
            if (valid) {
                if (accountName !== null && accountName !== '') {
                    var url = req.headers.host + '/' + req.url;
                    logHandler.fire('info', format('[{0}][ip {1}] {2} ', accountName, ip,
                        'sent the request to ' + url));
                }
                next();
            }
        }
    } catch (error) {
        next(error);
    }
};

exports.setmiddleware = validateRequest;