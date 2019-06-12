const auditSqlCmd = require('../database/sqlcommand.audit');
const response = require('../models/audit/model.audit');
const status = require('../resources/resource.api.status');
const { poolPromise, sql } = require('../database/dbconnection');
const security = require('../services/service.security');
const moment = require('moment');
const format = require('string-format');
const common = require('../common/common');

//delete audit
exports.deleteAudit = async (auditData) => {

    var ids = auditData.auditId.split(',');
    for (var i = 0; i < ids.length; i++) {
        var id = parseInt(security.decrypt(ids[i].split('_')[0]));
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Id', sql.BigInt, id)
            .query(auditSqlCmd.deleteAudit);
    }
   
    response.model.statusmessage = status.common.suscess;
    response.model.responsecode = status.common.suscesscode;
    response.model.audit = true;

    return response;
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
        .input('StartDate', sql.DateTime, dateRange.startDate)
        .input('EndDate', sql.DateTime, dateRange.endDate)
        .query(format(query, searchString));

    if (result.recordset.length >= 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        var audits d= [];
        result.recordset.forEach(function (value) {
            audits.push({
                AuditId: security.encrypt(value.Id + '_' + security.serverKey()),
                StaffName: value.StaffName,
                AuditContent: value.AuditContent,
                AppName: value.AppName,
                CreatedDate: moment(value.CreatedDate).format('DD/MM/YYYY HH:mm:ss'),
                TotalRecord: value.TotalRecord
            });
        });

        response.model.audit = audits;
    }

    return response;
};
