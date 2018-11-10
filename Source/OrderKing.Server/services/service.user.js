const { poolPromise, sql } = require('../database/dbconnection');
const moment = require('moment');
const reponse = require('../models/user/model.userinfo');
const status = require('../resources/resource.api.status');
const security = require('../services/service.security');
const userSqlCmd = require('../database/sqlcommand.user');
const sessionLoginHandler = require('../eventHandlers/event.handler.sessionlogin');

exports.GetUserInfo = async function (accountName) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('@AccountName', sql.NVarChar, accountName)
        .query(userSqlCmd.getUserInfo);

    if (result.recordset.length > 0) {
        reponse.model.statusmessage = status.common.suscess;
        reponse.model.responsecode = status.common.suscesscode;
        reponse.model.userinfo = result.recordset;
    }
    return reponse;
};