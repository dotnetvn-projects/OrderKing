const { poolPromise, sql } = require('../database/dbconnection');
const moment = require('moment');
const sqlcmd = require('../database/auth-sqlcommand');
var events = require('events');


var eventEmitter = new events.EventEmitter();


eventEmitter.on('update', async (accountId) => {
    //insert an record to sessionlogin table
    var now = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
    const pool = await poolPromise;
    const result = await pool.request()
        .input('AccountId', sql.Int, accountId)
        .input('LastAccessTime', sql.DateTime, now)
        .query(sqlcmd.updateLastAccessTimeLoginSession);
    console.log(result.rowsAffected[0]);
});

eventEmitter.on('insert', async (accountId, ip, userAgent, referrer,
                                     accountToken, expireddate) => {
    //insert an record to sessionlogin table
    var now = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
    var expired = new Date(expireddate);
    const pool = await poolPromise;
    const result = await pool.request()
        .input('AccountId', sql.Int,accountId)
        .input('Ip', sql.NVarChar, ip)                  
        .input('UsetAgent', sql.NVarChar, userAgent)
        .input('Referrer', sql.NVarChar, referrer)
        .input('LoginTime', sql.DateTime, now)
        .input('LastAccessTime', sql.DateTime, now)
        .input('AccessToken', sql.NVarChar, accountToken)
        .input('AccessTokenExpired', sql.DateTime, expired)
        .query(sqlcmd.insertLoginSession);
    
       console.log(result.rowsAffected[0]);
});

eventEmitter.on('makeExpired', async (accessToken) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('AccessToken', sql.NVarChar, accessToken)
        .query(sqlcmd.updateExpiredDateLoginSession);
    console.log(result.rowsAffected[0]);
});

var action = function (type, accountId, ip, userAgent, referrer, accountToken, expireddate) {
    eventEmitter.emit(type, accountId, ip, userAgent, referrer, accountToken, expireddate);
};

exports.fire = action;
