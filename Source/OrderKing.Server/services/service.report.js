const { poolPromise, sql } = require('../database/dbconnection');
const response = require('../models/report/model.report');
const status = require('../resources/resource.api.status');
const security = require('../services/service.security');
const reportSqlCmd = require('../database/sqlcommand.report');
const moment = require('moment');
const common = require('../common/common');

// get summary report
exports.getSummaryReport = async (storeId) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, storeId)
        .query(reportSqlCmd.SummaryReport);

    if (result.recordset.length >= 0) {
        const data = result.recordset[0];
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.data = {
            TotalOrder: data.TotalOrder,
            TotalNewOrder: data.TotalNewOrder,
            TotalProduct: data.TotalProduct,
            TotalRevenue: data.TotalRevenue
        };
    }
    return response;
};

// get product list sold in day
exports.getProductListSoldInDay = async (reportData) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, reportData.storeId)
        .input('PageSize', sql.BigInt, reportData.pageSize)
        .input('PageNumber', sql.BigInt, reportData.pageNumber)
        .query(reportSqlCmd.ProductSoldInDay);

    if (result.recordset.length >= 0) {
        var report = [];
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;

        result.recordset.forEach(function (value) {
            report.push({
                TotalRecord: value.TotalRecord,
                ProductName: value.Name,
                ProductCode: value.Code,
                TotalSold: value.AmountSold,
                Revenue: value.Revenue
            });
        });

        response.model.data = report;
    }
    return response;
};

// get monthly revenue report in year
exports.getMonthRevenueInYear = async (reportData) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, reportData.storeId)
        .input('YearInput', sql.BigInt, reportData.year)
        .query(reportSqlCmd.MonthlyRevenueInYear);

    if (result.recordset.length >= 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.data = {
            Year: result.recordset[0].Year,
            YearRevenue: result.recordset[0].YearRevenue,
            January: result.recordset[0].January,
            February: result.recordset[0].February,
            March: result.recordset[0].March,
            April: result.recordset[0].April,
            May: result.recordset[0].May,
            June: result.recordset[0].June,
            July: result.recordset[0].July,
            August: result.recordset[0].August,
            September: result.recordset[0].September,
            October: result.recordset[0].October,
            November: result.recordset[0].November,
            December: result.recordset[0].December
        };
    }
    return response;
};

// get revenue report
exports.getRevenueReport = async (reportData) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, reportData.storeId)
        .query(reportSqlCmd.getRevenueReport);

    if (result.recordset.length >= 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.data = {
            DailyRevenue: result.recordset[0].DailyRevenue,
            WeeklyRevenue: result.recordset[0].WeeklyRevenue,
            MonthlyRevenue: result.recordset[0].MonthlyRevenue,
            YearlyRevenue: result.recordset[0].YearlyRevenue
        };
    }
    return response;
};

// get revenue report
exports.getSaleReportWithDateRagne = async (reportData) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;
    const dateRange = common.extractDateRange(reportData.StartDate, reportData.EndDate);
    var query = reportSqlCmd.getSaleReportWithDateRagne;

    var searchString = '';
    if (dateRange.startDate !== null && dateRange.endDate !== null) {
        searchString += '(CAST([ORDER].CreatedDate AS DATE) BETWEEN CAST(@StartDate AS DATE) AND CAST(@EndDate AS DATE)) ';
    } else if (dateRange.startDate !== null && dateRange.endDate === null) {
        searchString += 'CAST([ORDER].CreatedDate AS DATE) >= CAST(@StartDate AS DATE) ';
    } else if (dateRange.endDate !== null && dateRange.startDate === null) {
        searchString += 'CAST([ORDER].CreatedDate AS DATE) <= CAST(@EndDate AS DATE) ';
    }

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, reportData.storeId)
        .input('StartDate', sql.DateTime, startdate)
        .input('EndDate', sql.DateTime, enddate)
        .query(format(query, searchString));

    if (result.recordset.length >= 0) {
        var report = [];
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;

        result.recordset.forEach(function (value) {
            report.push({
                CreatedDate: moment(value.CreatedDate).format('DD/MM/YYYY'),
                TotalOrder: value.TotalOrder,
                Totalsold: value.Totalsold,
                TotalRevenue: value.TotalRevenue
            });
        });

        response.model.data = report;
    }
    return response;
};