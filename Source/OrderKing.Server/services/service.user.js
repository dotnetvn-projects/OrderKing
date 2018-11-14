const { poolPromise, sql } = require('../database/dbconnection');
const response = require('../models/user/model.userinfo');
const status = require('../resources/resource.api.status');
const security = require('../services/service.security');
const userSqlCmd = require('../database/sqlcommand.user');

//get user info uses token
exports.getUserInfoByAccessToken = async function (accessToken) {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('AccessToken', sql.NVarChar, accessToken)
        .query(userSqlCmd.getUserInfoByAccessToken);

    if (result.recordset.length > 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.userinfo =
            {
                accountname: result.recordset[0].AccountName,
                fullname: result.recordset[0].FullName,
                email: result.recordset[0].Email,
                phonenumber: result.recordset[0].PhoneNumber,
                address: result.recordset[0].Address,
                address2: result.recordset[0].Address2,
                identitycard: result.recordset[0].IdentityCard
            };
    }
    return response;
};

//update user info
exports.updateUserInfo = async function (userobject) {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('FullName', sql.NVarChar, userobject.fullname)
        .input('Email', sql.NVarChar, userobject.email)
        .input('PhoneNumber', sql.NVarChar, userobject.phonenumber)
        .input('Address', sql.NVarChar, userobject.address)
        .input('Address2', sql.NVarChar, userobject.address2)
        .input('IdentityCard', sql.NVarChar, userobject.identitycard)
        .input('AccountId', sql.BigInt, userobject.accountid)
        .query(userSqlCmd.updateUserInfo);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.userinfo = userobject;
    }
    return response;
};

//update avatar
exports.updateAvartar = async function (dataObject) {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    var buf = Buffer.from(dataObject.avatar, 'base64');

    const pool = await poolPromise;
    const result = await pool.request()
        .input("Avatar", sql.VarBinary, buf)
        .input("AccountId", sql.BigInt, dataObject.AccountId)
        .query(userSqlCmd.updateAvatar);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.userinfo =
            {
                Avatar: dataObject.avatar
            };
    }
    return response;
};

//update password
exports.changePassword = async function (dataObject) {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input("AccountId", sql.BigInt, dataObject.accountid)
        .query(userSqlCmd.getAccountByAccountId);

    if (result.recordset.length > 0) {
        var accountName = result.recordset[0].AccountName;
        var password = security.generateHash(accountName + "-" + dataObject.password);
        result = await pool.request()
            .input("AccountId", sql.BigInt, dataObject.accountid)
            .input("Password", sql.NVarChar, password)
            .query(userSqlCmd.updatePassword);

        if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
            response.model.statusmessage = status.common.suscess;
            response.model.responsecode = status.common.suscesscode;
            response.model.userinfo =
                {
                    accountname: accountName,
                    password: dataObject.password
                };
        }
    }
    return response;
};

//get account id
exports.getAccountIdByAccessToken = async (accessToken) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("AccessToken", sql.NVarChar, accessToken)
        .query(userSqlCmd.getAccountIdByToken);

    if (result.recordset.length > 0) {
        return result.recordset[0].AccountId;
    }
    return -1;
};

