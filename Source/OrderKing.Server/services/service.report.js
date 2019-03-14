const { poolPromise, sql } = require('../database/dbconnection');
const response = require('../models/report/model.report');
const status = require('../resources/resource.api.status');
const security = require('../services/service.security');
const reportSqlCmd = require('../database/sqlcommand.report');
const moment = require('moment');

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

// get product lis sold in day
exports.getProductListSoldInDay = async (storeId) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, storeId)
        .query(reportSqlCmd.ProductSoldInDay);

    if (result.recordset.length >= 0) {
        var report = [];
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;

        result.recordset.forEach(function (value) {
            report.push({
                ProductName: value.Name,
                TotalSold: value.AmountSold,
                Revenue: value.Revenue
            });
        });

        response.model.data = report;
    }
    return response;
};