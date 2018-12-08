var cronJob = require('cron').CronJob;
const { poolPromise, sql } = require('../database/dbconnection');
const moment = require('moment');
const authenSqlCmd = require('../database/sqlcommand.auth');
const sessionLoginHandler = require('../eventHandlers/event.handler.sessionlogin');

//minute pattern: 0 */5 * * * *

exports.updateTokenStatusJob = () => {
    var job = new cronJob({
        cronTime: '0 */30 * * * *',
        onTick: async function () {
            const pool = await poolPromise;
            const result = await pool.request()
                .query(authenSqlCmd.getAllTokenNotExpired);

            if (result.recordset.length > 0) {
                result.recordset.forEach(function (value) {
                    try {
                        var accessToken = value.AccessToken;
                        var current = moment();
                        var expiredDate = moment(value.AccessTokenExpired);
                        if (current > expiredDate) {
                            sessionLoginHandler.fire('makeExpired', accessToken);
                        }
                    }
                    catch(ex) {
                        //just ignore
                    }
                });
            }
        },
        start: true,
        timeZone: 'Asia/Ho_Chi_Minh'
    });
    job.start();
};

//exports.deleteTokenExpired = () => {
//    var job = new cronJob({
//        cronTime: '00 30 23 * * 0-6',
//        onTick: async function () {
//            const pool = await poolPromise.result;
//            const result = await pool.request()
//                .query(authenSqlCmd.getAllTokenNotExpired);

//            if (result.recordset.length > 0) {
//                result.recordset.forEach(function (value) {
//                    try {
//                        var accessToken = value.AccessToken;
//                        var current = moment();
//                        var expiredDate = moment(value.AccessTokenExpired);
//                        if (current > expiredDate) {
//                            sessionLoginHandler.fire('makeExpired', accessToken);
//                        }
//                    }
//                    catch {
//                        //just ignore
//                    }
//                });
//            }
//        },
//        start: true,
//        timeZone: 'Asia/Ho_Chi_Minh'
//    });
//    job.start();
//};
