const { poolPromise, sql } = require('../database/dbconnection');
const moment = require('moment');
const query = require('../database/authquery');
var events = require('events');


var eventEmitter = new events.EventEmitter();

eventEmitter.on('insert', (arg) => {
    //insert an record to sessionlogin table
    const pool = poolPromise.result;
    const result = pool.request().result
        .input('AccountId', sql.Int, arg.accountName)
        .input('Ip', sql.NVarChar, arg.ip)
        .input('UsetAgent', sql.NVarChar, arg.userAgent)
        .input('Referrer', sql.NVarChar, arg.referrer)
        .input('LoginTime', sql.DateTime, moment())
        .input('LastAccessTime', sql.DateTime, moment())
        .input('AccessToken', sql.NVarChar, arg.accountToken)
        .input('AccessTokenExpired', sql.DateTime, arg.expireddate)
        .query(query.insertLoginSession);

       console.log(result);
});

var fireInsert = function (accountName, ip, userAgent, referrer, accountToken, expireddate) {
    eventEmitter.emit(insert, accountName, ip, userAgent, referrer, accountToken, expireddate);
};

exports.fire = fireInsert;
