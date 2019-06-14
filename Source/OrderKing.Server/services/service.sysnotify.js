const response = require('../models/sysnotify/model.sysnotify');
const sysNotifySqlCmd = require('../database/sqlcommand.sysnotify');
const status = require('../resources/resource.api.status');
const { poolPromise, sql } = require('../database/dbconnection');
const security = require('../services/service.security');
const moment = require('moment');
const format = require('string-format');

exports.getNewestSysNotifyList = async function () {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .query(sysNotifySqlCmd.getNewestList);

    if (result.recordset.length > 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        var notifyItems = [];
        result.recordset.forEach(function (value) {
            notifies.push({
                id: security.encrypt(value.Id + '_' + security.serverKey()),
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

exports.getSysNotifyList = async function () {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .query(sysNotifySqlCmd.getList);

    if (result.recordset.length > 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        var notifyItems = [];
        result.recordset.forEach(function (value) {
            notifies.push({
                id: security.encrypt(value.Id + '_' + security.serverKey()),
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

