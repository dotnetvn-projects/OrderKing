const { poolPromise, sql } = require('../database/dbconnection');
const response = require('../models/order/model.order');
const status = require('../resources/resource.api.status');
const security = require('../services/service.security');
const orderSqlCmd = require('../database/sqlcommand.order');
const moment = require('moment');
const statusValue = require('../resources/resource.api.value');
const format = require('string-format');

//helper function

//generate order code
function generateOrderCode(id) {
    if (id < 10) {
        return 'DH00' + id;
    } else if (id < 100 && id > 9) {
        return 'DH0' + id;
    }
    else {
        return 'DH' + id;
    }
}

//end helper

//get order list by store id
exports.getOrderListByStore = async (storeId) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, storeId)
        .query(format(orderSqlCmd.getOrderListByStore, ' '));

    if (result.recordset.length >= 0) {
        var orders = [];
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;

        result.recordset.forEach(function (value) {
            orders.push({
                orderid: security.encrypt(value.Id + '_' + security.serverKey()),
                storename: value.StoreName,
                ordercode: value.OrderCode,
                seqnum: value.SeqNum,
                totalprice: value.TotalPrice,
                amount: value.TotalAmount,
                createddate: moment(value.CreatedDate).format('DD/MM/YYYY HH:mm:ss'),
                printeddate: moment(value.PrintedDate).format('DD/MM/YYYY HH:mm:ss'),
                orderstatus: value.OrderStatus,
                selleraccount: value.SellerAccount,
                seller: value.Seller
            });
        });

        response.model.orderinfo = orders;
    }
    return response;
};

//get orders of seller
exports.getOrderListBySellerId = async (sellerid) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, storeId)
        .query(format(orderSqlCmd.getOrderListByStore,' AND SellerId= '+ sellerid));

    if (result.recordset.length > 0) {
        var orders = [];
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;

        result.recordset.forEach(function (value) {
            orders.push({
                orderid: security.encrypt(value.Id + '_' + security.serverKey()),
                storename: value.StoreName,
                ordercode: value.OrderCode,
                seqnum: value.SeqNum,
                totalprice: value.TotalPrice,
                amount: value.TotalAmount,
                createddate: moment(value.CreatedDate).format('DD/MM/YYYY HH:mm:ss'),
                printeddate: moment(value.PrintedDate).format('DD/MM/YYYY HH:mm:ss'),
                orderstatus: value.OrderStatus,
                selleraccount: value.SellerAccount,
                seller: value.Seller,
                commemt: value.Comment
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

    if (result.recordset.length >= 0) {
        var orders = [];
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;

        result.recordset.forEach(function (value) {
            orders.push({
                orderid: security.encrypt(value.Id + '_' + security.serverKey()),
                storename: value.StoreName,
                ordercode: value.OrderCode,
                seqnum: value.SeqNum,
                totalprice: value.TotalPrice,
                amount: value.TotalAmount,
                createddate: moment(value.CreatedDate).format('DD/MM/YYYY HH:mm:ss'),
                printeddate: moment(value.PrintedDate).format('DD/MM/YYYY HH:mm:ss'),
                orderstatus: value.OrderStatus,
                selleraccount: value.SellerAccount,
                seller: value.Seller,
                commemt: value.Comment
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

    var seqNum = -1;
    if (orderInfo.seqnum !== undefined && orderInfo.seqnum > 0) {
        seqNum = orderInfo.seqNum;
    }

    const pool = await poolPromise;
    var result = await pool.request()
        .input('SeqNum', sql.NVarChar, seqNum)
        .input('SellerId', sql.NVarChar, orderInfo.sellerid)
        .input('StoreId', sql.NVarChar, orderInfo.storeid)
        .input('TotalPrice', sql.Int, orderInfo.price)
        .input('TotalAmount', sql.Int, orderInfo.amount)
        .input('OrderStatus', sql.NVarChar, statusValue.orderStatus.NotCompleted)
        .query(orderSqlCmd.createNewOrder);

    if (result.recordset.length > 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;

        var orderId = result.recordset[0].OrderId;
        var orderCode = generateOrderCode(orderId);

        result = await pool.request()
            .input('OrderCode', sql.NVarChar, orderCode)
            .input('OrderId', sql.BigInt, orderId)
            .query(orderSqlCmd.updateOrderCode);

        response.model.orderinfo = {
            code: orderCode, orderid: security.encrypt(orderId + '_' + security.serverKey())
        };
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
        response.model.orderinfo = security.encrypt(result.recordset[0].OrderDetailId + '_' + security.serverKey());
    }

    return response;
};

//update order status
exports.updateOrderStatus = async (statusInfo) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('OrderId', sql.BigInt, statusInfo.orderid)
        .input('StoreId', sql.BigInt, statusInfo.storeid)
        .input('Status', sql.NVarChar, statusInfo.orderstatus)
        .query(orderSqlCmd.updateOrderStatus);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.orderinfo = security.encrypt(statusInfo.orderid + '_' + security.serverKey());
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
            orderid: security.encrypt(result.recordset[0].Id + '_' + security.serverKey()),
            storename: result.recordset[0].StoreName,
            ordercode: result.recordset[0].OrderCode,
            seqnum: result.recordset[0].SeqNum,
            totalprice: result.recordset[0].TotalPrice,
            amount: result.recordset[0].TotalAmount,
            createddate: moment(result.recordset[0].CreatedDate).format('DD/MM/YYYY HH:mm:ss'),
            printeddate: moment(result.recordset[0].PrintedDate).format('DD/MM/YYYY HH:mm:ss'),
            orderstatus: result.recordset[0].OrderStatus,
            selleraccount: result.recordset[0].SellerAccount,
            seller: result.recordset[0].Seller,
            commemt: result.recordset[0].Comment
        };
    }
    return response;
};
