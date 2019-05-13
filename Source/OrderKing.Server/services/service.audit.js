const auditSqlCmd = require('../database/sqlcommand.audit');
const response = require('../models/audit/mode.audit');
const status = require('../resources/resource.api.status');
const { poolPromise, sql } = require('../database/dbconnection');
const security = require('../services/service.security');
const moment = require('moment');
const format = require('string-format');
const auditHandler = require('../eventHandlers/event.handler.audit');

//delete audit
exports.deleteAudit = async (auditData) => {
    var data = auditData.split(',');
    var auditId = "";
    for (var i = 0; i < data.length; i++) {
        var id = security.decrypt(data[i]).split('_')[0];
        if (auditId !== "") {
            auditId = auditid + ", " + id;
        } else {
            auditId = id;
        }
    }
    auditHandler.fire("deleteAudit", auditId); 
};

//get audit list in store
exports.getAuditList = async (auditData) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;
    const dateRange = common.extractDateRange(auditData.startDate, auditData.endDate);
    var searchString = '';
    if (dateRange.startDate !== null && dateRange.endDate !== null) {
        searchString += 'AND (CAST([AUDIT].CreatedDate AS DATE) BETWEEN CAST(@StartDate AS DATE) AND CAST(@EndDate AS DATE)) ';
    } else if (dateRange.startDate !== null && dateRange.endDate === null) {
        searchString += 'AND CAST([AUDIT].CreatedDate AS DATE) >= CAST(@StartDate AS DATE) ';
    } else if (dateRange.endDate !== null && dateRange.startDate === null) {
        searchString += 'AND CAST([AUDIT].CreatedDate AS DATE) <= CAST(@EndDate AS DATE) ';
    }

    var query = auditSqlCmd.getAuditList;
    const pool = await poolPromise;
    var result = await pool.request()
        .input('StoreId', sql.BigInt, auditData.storeId)
        .input('PageSize', sql.Int, auditData.pageSize)
        .input('PageNumber', sql.Int, auditData.pageNumber)
        .input('StartDate', sql.DateTime, startDate)
        .input('EndDate', sql.DateTime, endDate)
        .query(format(query, searchString));

    if (result.recordset.length > 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        var audits = [];
        result.recordset.forEach(function (value) {
            audits.push({
                auditId: security.encrypt(value.Id + '_' + security.serverKey()),
                staffName: value.StaffName,
                auditContent: value.AuditContent,
                createdDate: moment(value.CreatedDate).format('DD/MM/YYYY')
            });
        });

        response.model.audit = audits;
    }

    return response;
};
