const response = require('../models/sysnotify/model.sysnotify');
const sysNotifySqlCmd = require('../database/sqlcommand.sysnotify');
const status = require('../resources/resource.api.status');
const { poolPromise, sql } = require('../database/dbconnection');
const security = require('../services/service.security');
const moment = require('moment');
const format = require('string-format');

exports.getNewestSysNotifyList = async function (sysNotifyData) {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('AccountId', sql.BigInt, sysNotifyData.accountId)
        .query(sysNotifySqlCmd.getNewestList);

    if (result.recordset !== null) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        var notifyItems = [];
        result.recordset.forEach(function (value) {
            notifyItems.push({
                Id: security.encrypt(value.Id + '_' + security.serverKey()),
                Title: value.Title,
                Content: value.Content,
                CreatedDate: moment(value.CreatedDate).format('DD/MM/YYYY HH:mm:ss'),
                UpdatedDate: moment(value.UpdatedDate).format('DD/MM/YYYY HH:mm:ss')
            });
        });

        response.model.notify = notifyItems;
    }

    return response;
};

exports.getSysNotifyList = async function (sysNotifyData) {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('PageSize', sql.Int, sysNotifyData.pageSize)
        .input('PageNumber', sql.Int, sysNotifyData.pageNumber)
        .input('AccountId', sql.BigInt, sysNotifyData.accountId)
        .query(sysNotifySqlCmd.getList);

    if (result.recordset !== null) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        var notifyItems = [];
        result.recordset.forEach(function (value) {
            notifyItems.push({
                Id: security.encrypt(value.Id + '_' + security.serverKey()),
                Title: value.Title,
                Content: value.Content,
                CreatedDate: moment(value.CreatedDate).format('DD/MM/YYYY HH:mm:ss'),
                UpdatedDate: moment(value.UpdatedDate).format('DD/MM/YYYY HH:mm:ss'),
                DateGroup: moment(value.UpdatedDate).format('DD/MM/YYYY'),
                TotalRecord: value.TotalRecord
            });
        });

        response.model.notify = notifyItems;
    }

    return response;
};

exports.getSysNotifyDetail = async function (sysNotifyData) {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('Id', sql.Int, sysNotifyData.id)
        .query(sysNotifySqlCmd.getDetail);

    if (result.recordset !== null) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        var value = result.recordset[0];

        response.model.notify = {
            Id: security.encrypt(value.Id + '_' + security.serverKey()),
            Title: value.Title,
            Content: value.Content,
            CreatedDate: moment(value.CreatedDate).format('DD/MM/YYYY HH:mm:ss'),
            UpdatedDate: moment(value.UpdatedDate).format('DD/MM/YYYY HH:mm:ss')
        };
    }

    return response;
};

//update HasRead state of sysnotify item
exports.updateHasReadSysNotify= async (sysNotifyData) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('SysNotifyId', sql.BigInt, sysNotifyData.sysNotifyId)
        .input('AccountId', sql.BigInt, sysNotifyData.accountId)
        .input('HasRead', sql.Bit, sysNotifyData.hasRead)
        .query(sysNotifySqlCmd.updateHasRead);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
    }

    return response;
};

//update HasRead of sysnotifys for every single account
exports.updateHasReadSysNotifyForAccount = async (sysNotifyData) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('AccountId', sql.BigInt, sysNotifyData.accountId)
        .input('HasRead', sql.Bit, sysNotifyData.hasRead)
        .query(sysNotifySqlCmd.updateHasReadForAccount);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
    }

    return response;
};

