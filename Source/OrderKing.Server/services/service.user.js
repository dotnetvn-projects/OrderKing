const { poolPromise, sql } = require('../database/dbconnection');
const response = require('../models/user/model.userinfo');
const status = require('../resources/resource.api.status');
const security = require('../services/service.security');
const userSqlCmd = require('../database/sqlcommand.user');

//get user info uses token
exports.getUserInfoByAccessToken = async function (accessToken) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('AccessToken', sql.NVarChar, accessToken)
        .query(userSqlCmd.getUserInfoByAccessToken);

    if (result.recordset.length > 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;

        var accountId = security.encrypt(result.recordset[0].AccountId);
        response.model.userinfo = {
            AccountId: accountId,
            AccountName: result.recordset[0].AccountName,
            FullName: result.recordset[0].FullName,
            Email: result.recordset[0].Email,
            PhoneNumber: result.recordset[0].PhoneNumber,
            Address: result.recordset[0].Address,
            Address2: result.recordset[0].Address2,
            IdentityCard: result.recordset[0].IdentityCard
        };
    }
    else {
        response.model.statusmessage = status.common.failed;
        response.model.responsecode = status.common.failedcode;
    }
    return response;
};

//update user info
exports.updateUserInfo = async function (userobject) {
    var accountId = security.decrypt(userobject.AccountId);
    const pool = await poolPromise;
    const result = await pool.request()
        .input('FullName', sql.NVarChar, userobject.FullName)
        .input('Email', sql.NVarChar, userobject.Email)
        .input('PhoneNumber', sql.NVarChar, userobject.PhoneNumber)
        .input('Address', sql.NVarChar, userobject.Address)
        .input('Address2', sql.NVarChar, userobject.Address2)
        .input('IdentityCard', sql.NVarChar, userobject.IdentityCard)
        .input('AccountId', sql.BigInt, accountId)
        .query(userSqlCmd.updateUserInfo);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.userinfo = userobject;
    }
    else {
        response.model.statusmessage = status.common.failed;
        response.model.responsecode = status.common.failedcode;
    }
    return response;
};

//update avatar
exports.updateAvartar = async function (dataObject) {
    var accountId = security.decrypt(dataObject.AccountId);
    var buf = Buffer.from(dataObject.AvatarImage, 'base64'); 
    const pool = await poolPromise;
    const result = await pool.request()
        .input("Avatar", sql.VarBinary, buf)
        .input("AccountId", sql.BigInt, accountId)
        .query(userSqlCmd.updateAvatar);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.userinfo = dataObject;
    }
    else {
        response.model.statusmessage = status.common.failed;
        response.model.responsecode = status.common.failedcode;
    }
    return response;
};

//update password
exports.changePassword = async function (dataObject) {
    var accountId = security.decrypt(dataObject.AccountId);
    const pool = await poolPromise;
    const result = await pool.request()
        .input("Password", sql.VarBinary, dataObject.Password)
        .input("AccountId", sql.BigInt, accountId)
        .query(userSqlCmd.updateAvatar);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.userinfo = dataObject;
    }
    else {
        response.model.statusmessage = status.common.failed;
        response.model.responsecode = status.common.failedcode;
    }
    return response;
};

