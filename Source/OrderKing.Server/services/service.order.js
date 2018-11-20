const { poolPromise, sql } = require('../database/dbconnection');
const response = require('../models/order/model.order');
const status = require('../resources/resource.api.status');
const security = require('../services/service.security');
const orderSqlCmd = require('../database/sqlcommand.order');
const moment = require('moment');
const statusValue = require('../resources/resource.api.value');
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
        var orders = [];
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;

        result.recordset.forEach(function (value) {
            orders.push({
                orderid: security.encrypt(value.Id),
                storename: value.StoreName,
                ordercode: value.OrderCode,
                seqnum: value.SeqNum,
                totalprice: value.TotalPrice,
                amount: value.TotalAmount,
                createddate: value.CreatedDate,
                printeddate: value.PrintedDate,
                orderstatus: value.OrderStatus,
                selleraccount: value.SellerAccount,
                seller: value.Seller
            });
        });

        response.model.orderinfo = orders;
    }
    return response;
};

//search order by store:
exports.searchOrderListByStore = async (searchPattern) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;
    var query = orderSqlCmd.getOrderListByStore;
    var searchString = '';
    var startdate = null;
    var enddate = null;
    if (searchPattern.ordercode !== undefined
        && (searchPattern.ordercode !== '' && searchPattern.ordercode !== null)) {
        searchString += 'AND OrderCode = @OrderCode ';
        startdate = new Date(searchPattern.startdate);
    }
    if (searchPattern.startdate !== undefined
        && (searchPattern.startdate !== '' && searchPattern.startdate !==null)) {
        searchString += 'AND (CreatedDate BETWEEN @StartDate AND @EndDate) ';
        enddate = new Date(searchPattern.enddate);
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
        .input('StoreId', sql.BigInt, searchPattern.storeid)
        .input('OrderCode', sql.NVarChar, searchPattern.ordercode)
        .input('StartDate', sql.NVarChar, startdate)
        .input('EndDate', sql.NVarChar, enddate)
        .input('Status', sql.NVarChar, searchPattern.status)
        .input('Seller', sql.NVarChar, searchPattern.seller)
        .query(format(query, searchString));

    if (result.recordset.length > 0) {
        var orders = [];
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;

        result.recordset.forEach(function (value) {
            orders.push({
                orderid: security.encrypt(value.Id),
                storename: value.StoreName,
                ordercode: value.OrderCode,
                seqnum: value.SeqNum,
                totalprice: value.TotalPrice,
                amount: value.TotalAmount,
                createddate: value.CreatedDate,
                printeddate: value.PrintedDate,
                orderstatus: value.OrderStatus,
                selleraccount: value.SellerAccount,
                seller: value.Seller
            });
        });

        response.model.orderinfo = orders;
    }
    return response;
};

//add new order
exports.createNewOrder = async (orderInfo) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('OrderCode', sql.BigInt, orderInfo.ordercode)
        .input('SeqNum', sql.NVarChar, orderInfo.seqnum)
        .input('SellerId', sql.NVarChar, orderInfo.sellerid)
        .input('StoreId', sql.NVarChar, orderInfo.storeid)
        .input('OrderStatus', sql.NVarChar, statusValue.orderStatus.NotCompleted)
        .input('PrintedDate', sql.DateTime, null)
        .query(orderSqlCmd.createNewOrder);

    if (result.recordset.length > 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.orderinfo = result.recordset[0].OrderId;
    }

    return response;
};

//add new order
exports.createOrderDetail = async (orderDetailInfo) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('OrderId', sql.BigInt, orderDetailInfo.orderid)
        .input('ProductId', sql.NVarChar, orderInfo.productid)
        .input('Amount', sql.NVarChar, orderInfo.amount)
        .input('Price', sql.NVarChar, orderInfo.price)
        .query(orderSqlCmd.createOrderDetail);

    if (result.recordset.length > 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.orderinfo = result.recordset[0].OrderDetailId;
    }

    return response;
};

//update order status
exports.updateOrderStatus = async (orderDetailInfo) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('OrderId', sql.BigInt, orderDetailInfo.orderid)
        .input('StoreId', sql.BigInt, orderDetailInfo.storeid)
        .input('Status', sql.NVarChar, orderInfo.orderstatus)
        .query(orderSqlCmd.updateOrderStatus);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.orderinfo = orderDetailInfo.orderid;
    }

    return response;
};

//get order info
exports.getOrderInfo = async (orderInfo) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, orderInfo.storeid)
        .input('OrderId', sql.BigInt, orderInfo.orderid)
        .query(orderSqlCmd.getOrderInfo);

    if (result.recordset.length > 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.orderinfo = {
            orderid: security.encrypt(result.recordset[0].Id),
            storename: result.recordset[0].StoreName,
            ordercode: result.recordset[0].OrderCode,
            seqnum: result.recordset[0].SeqNum,
            totalprice: result.recordset[0].TotalPrice,
            amount: result.recordset[0].TotalAmount,
            createddate: result.recordset[0].CreatedDate,
            printeddate: result.recordset[0].PrintedDate,
            orderstatus: result.recordset[0].OrderStatus,
            selleraccount: result.recordset[0].SellerAccount,
            seller: result.recordset[0].Seller
        };
    }
    return response;
};