const { poolPromise, sql } = require('../database/dbconnection');
const response = require('../models/store/model.storeinfo');
const status = require('../resources/resource.api.status');
const security = require('../services/service.security');
const moment = require('moment');
const storeSqlCmd = require('../database/sqlcommand.store');

//get info by access token
exports.getStoreInfoByAccessToken = async (accessToken) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('AccessToken', sql.NVarChar, accessToken)
        .query(storeSqlCmd.getStoreInfoByAccessToken);

    if (result.recordset.length > 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.storeinfo =
            {
                storeid: security.encrypt(result.recordset[0].Id + '_' + security.serverKey()),
                storename: result.recordset[0].StoreName,
                email: result.recordset[0].Email,
                address: result.recordset[0].StoreAddress,
                phone: result.recordset[0].StorePhone,
                slogan: result.recordset[0].Slogan,
                manager: result.recordset[0].Manager,
                createddate: moment(result.recordset[0].CreatedDate).format('DD/MM/YYYY')
            };
    }
    return response;
};

//update store info
exports.updateStoreInfo = async (storeInfo, storeId) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreName', sql.NVarChar, storeInfo.storename)
        .input('Email', sql.NVarChar, storeInfo.email)
        .input('StoreAddress', sql.NVarChar, storeInfo.address)
        .input('StorePhone', sql.NVarChar, storeInfo.phone)
        .input('Slogan', sql.NVarChar, storeInfo.slogan)
        .input('StoreId', sql.BigInt, storeId)
        .query(storeSqlCmd.updateStoreInfo);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.storeinfo = {
            storeid: security.encrypt(storeId + '_' + security.serverKey())
        };
    }
    return response;
};

//add new member
exports.addNewMember = async (info) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, info.storeid)
        .input('MemberId', sql.BigInt, info.memberid)
        .query(storeSqlCmd.addNewMember);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
    }
    return response;
};

//remove member
exports.removeMember = async (info) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, info.storeid)
        .input('MemberId', sql.BigInt, info.memberid)
        .query(storeSqlCmd.removeMember);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
    }
    return response;
};

//update logo
exports.updateLogo = async function (dataObject) {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input("Logo", sql.VarBinary, dataObject.logo)
        .input("StoreId", sql.BigInt, dataObject.storeid)
        .query(storeSqlCmd.updateLogo);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
    }
    return response;
};

//get store id by access token
exports.getStoreIdByAccessToken = async (accessToken) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("AccessToken", sql.NVarChar, accessToken)
        .query(storeSqlCmd.getStoreIdByAccessToken);

    if (result.recordset.length > 0) {
        return result.recordset[0].StoreId;
    }
    return -1;
};

//get member in store
exports.getMemberInStore = async (storeId, currentAccountId) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, storeId)
        .input('AccountId', sql.BigInt, currentAccountId)
        .query(storeSqlCmd.getMemberInStore);

    if (result.recordset.length > 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        var members = [];
        result.recordset.forEach(function (value) {
            members.push({
                memberid: security.encrypt(value.MemberId + '_'+ security.serverKey()),
                storename: value.StoreName,
                accountname: value.AccountName,
                fullname: value.FullName,
                email: value.Email,
                phonenumber: value.PhoneNumber,
                address: value.Address,
                address2: value.Address2,
                identityCard: value.IdentityCard,
                isactived: value.IsActived,
                createddate: moment(value.CreatedDate).format('DD/MM/YYYY')
            });
        });
        response.model.storeinfo = members;
    }
    return response;
};

//create new store
exports.createNewStore = async (storeInfo) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreName', sql.NVarChar, storeInfo.storename)
        .input('Email', sql.NVarChar, storeInfo.email)
        .input('OwnerId', sql.BigInt, storeInfo.owner)
        .input('CreatedDate', sql.DateTime, new Date(moment()))
        .input('StoreAddress', sql.NVarChar, storeInfo.address)
        .input('StorePhone', sql.NVarChar, storeInfo.phone)
        .input('Slogan', sql.NVarChar, storeInfo.slogan)
        .input('Logo', sql.VarBinary, storeInfo.logo)
        .query(storeSqlCmd.createNewStore);

    if (result.recordset.length > 0) {
        await this.addNewMember({
            memberid: storeInfo.owner, storeid: result.recordset[0].StoreId
        });

        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.storeinfo = result.recordset[0].StoreId;      
    }
    return response;
};

//get logo
exports.getLogo = async (accessToken) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input("AccessToken", sql.NVarChar, accessToken)
        .query(storeSqlCmd.getStoreLogo);

    if (result.recordset.length > 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.storeinfo = result.recordset[0].Logo;
    }
    return response;
};