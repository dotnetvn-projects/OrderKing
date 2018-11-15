const { poolPromise, sql } = require('../database/dbconnection');
const response = require('../models/user/model.userinfo');
const status = require('../resources/resource.api.status');
const security = require('../services/service.security');
const userSqlCmd = require('../database/sqlcommand.user');
const moment = require('moment');

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
exports.updateUserInfo = async function (userobject, accounId) {
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
        .input('AccountId', sql.BigInt, accounId)
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
        .input("AccountId", sql.BigInt, dataObject.accountid)
        .query(userSqlCmd.updateAvatar);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
    }
    return response;
};

//update password
exports.changePassword = async function (dataObject) {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    var account = await this.getAccountByAccountId(dataObject.accountid);

    if (account !== null) {
        var accountName = account.AccountName;
        var password = security.generateHash(accountName + "-" + dataObject.password);

        const pool = await poolPromise;
        const result = await pool.request()
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

//get account by account name
exports.getAccountByAccountName = async (account) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("AccountName", sql.NVarChar, account)
        .query(userSqlCmd.getAccountByAccountName);

    if (result.recordset.length > 0) {
        return result.recordset[0];
    }
    return null;
};

//get account by account id
exports.getAccountByAccountId = async (accountId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("AccountId", sql.BigInt, accountId)
        .query(userSqlCmd.getAccountByAccountId);

    if (result.recordset.length > 0) {
        return result.recordset[0];
    }
    return null;
};

//create new account
exports.createNewAccount = async (info) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    var hash = security.generateHash(info.accountname);
    var password = security.encrypt(info.accountname + "-" + info.password + "-" + hash);
    const pool = await poolPromise;
    const result = await pool.request()
        .input("AccountName", sql.BigInt, info.accountname)
        .input("Password", sql.BigInt, password)
        .input("CreatedDate", sql.DateTime, new Date(moment()))
        .input("HashKey", sql.BigInt, hash)
        .input("IsActived", sql.Bit, '1')
        .query(userSqlCmd.createAccount);

    if (result.recordset.length > 0) {
        var accountId = result.recordset[0].AccountId;
        result = await pool.request()
            .input("AccountId", sql.BigInt, accountId)
            .input("FullName", sql.NVarChar, info.fullname)
            .input("Email", sql.NVarChar, info.email)
            .input("PhoneNumber", sql.NVarChar, info.phonenumber)
            .input("Address", sql.NVarChar, info.address)
            .input("Address2", sql.NVarChar, info.address2)
                .input("IdentityCard", sql.NVarChar, info.identitycard)
            .query(userSqlCmd.createUserProfile);

        response.model.statusmessage = status.common.failed;
        response.model.responsecode = status.common.failedcode;
        response.model.userinfo = result.recordset[0].AccountId;
    }

    return response;
};