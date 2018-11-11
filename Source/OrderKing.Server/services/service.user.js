const { poolPromise, sql } = require('../database/dbconnection');
const reponse = require('../models/user/model.userinfo');
const status = require('../resources/resource.api.status');
const userSqlCmd = require('../database/sqlcommand.user');

exports.GetUserInfoByAccessToken = async function (accessToken) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('AccessToken', sql.NVarChar, accessToken)
        .query(userSqlCmd.getUserInfoByAccessToken);

    if (result.recordset.length > 0) {
        reponse.model.statusmessage = status.common.suscess;
        reponse.model.responsecode = status.common.suscesscode;
        reponse.model.userinfo = result.recordset[0];
    }
    else {
        reponse.model.statusmessage = status.common.failed;
        reponse.model.responsecode = status.common.failedcode;
    }
    return reponse;
};