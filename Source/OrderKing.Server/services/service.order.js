const { poolPromise, sql } = require('../database/dbconnection');
const response = require('../models/order/model.order');
const status = require('../resources/resource.api.status');
const security = require('../services/service.security');
const orderSqlCmd = require('../database/sqlcommand.order');
const moment = require('moment');
const format = require('string-format');

//get order list by store id
exports.getOrderListByStore = async (storeId) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, storeId)
        .query(orderSqlCmd.getOrderListByStore);

    if (result.recordset.length > 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.orderinfo = result.recordset;
    }
    return response;
};

//search order by store:
exports.searchOrderListByStore = async (searchPattern) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;
    var query = orderSqlCmd.getOrderListByStore;
    var searchString = '';

    if (searchPattern.ordercode !== undefined
        && (searchPattern.ordercode !== '' && searchPattern.ordercode !== null)) {
        searchString += 'AND OrderCode = @OrderCode ';
    }
    if (searchPattern.startdate !== undefined
        && (searchPattern.startdate !== '' && searchPattern.startdate !==null)) {
        searchString += 'AND (CreatedDate BETWEEN @StartDate AND @EndDate) ';
    }
    if (searchPattern.status !== undefined
        && (searchPattern.status !== '' && searchPattern.status !== null)) {
        searchString += 'AND OrderStatus = @Status ';
    }
    if (searchPattern.seller !== undefined
        && (searchPattern.seller !== '' && searchPattern.seller !== null)) {
        searchString += "AND (Account.AccountName LIKE '%@Seller%' OR UserProfile.FullName LIKE '%@Seller%' ";
    }

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, storeId)
        .input('OrderCode', sql.NVarChar, searchPattern.ordercode)
        .input('StartDate', sql.NVarChar, searchPattern.startdate)
        .input('EndDate', sql.NVarChar, searchPattern.enddate)
        .input('Status', sql.NVarChar, searchPattern.status)
        .input('Seller', sql.NVarChar, searchPattern.seller)
        .query(format(query, searchString));

    if (result.recordset.length > 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.orderinfo = result.recordset;
    }
    return response;
};