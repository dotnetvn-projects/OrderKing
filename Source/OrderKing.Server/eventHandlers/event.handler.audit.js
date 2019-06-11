const { poolPromise, sql } = require('../database/dbconnection');
const auditSqlCmd = require('../database/sqlcommand.audit');
const userService = require('../services/service.user');
var events = require('events');

var eventEmitter = new events.EventEmitter();

eventEmitter.on('insertAudit', async (storeId, accessToken, content, appName) => {
    var accountId = await userService.getAccountIdByAccessToken(accessToken);
    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, storeId)
        .input('AccountId', sql.BigInt, accountId)
        .input('AuditContent', sql.NVarChar, content)
        .input('AppName', sql.NVarChar, appName)
        .query(auditSqlCmd.insertAudit);
    console.log(result.rowsAffected[0]);
});

var action = function (type, storeId, accessToken, content, appName, auditId) {
    eventEmitter.emit(type, storeId, accessToken, content, appName, auditId);
};

exports.fire = action;
