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
        return 'DH-#00' + id;
    } else if (id < 100 && id > 9) {
        return 'DH-#0' + id;
    }
    else {
        return 'DH-#' + id;
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
                updateddate: moment(value.UpdatedDate).format('DD/MM/YYYY HH:mm:ss'),
                orderstatus: value.OrderStatus,
                selleraccount: value.SellerAccount,
                seller: value.Seller,
                comment: value.Comment,
                paymentmethod: value.PaymentMethod
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
                updateddate: moment(value.UpdatedDate).format('DD/MM/YYYY HH:mm:ss'),
                orderstatus: value.OrderStatus,
                selleraccount: value.SellerAccount,
                seller: value.Seller,
                commemt: value.Comment,
                paymentmethod: value.PaymentMethod
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

    if (searchPattern.ordercode !== undefined && searchPattern.ordercode !== '' && searchPattern.ordercode !== null) {
        searchString += 'AND OrderCode = @OrderCode ';       
    }
    if ((searchPattern.startdate !== undefined && searchPattern.startdate !== '' && searchPattern.startdate !== null)
        &&
        (searchPattern.enddate !== undefined && searchPattern.enddate !== '' && searchPattern.enddate !== null)) {
        searchString += 'AND ([Order].CreatedDate BETWEEN @StartDate AND @EndDate) ';

        var startDay = searchPattern.startdate.split('/')[0];
        var startMonth = searchPattern.startdate.split('/')[1];
        var startYear = searchPattern.startdate.split('/')[2];
        var endDay = searchPattern.enddate.split('/')[0];
        var endMonth = searchPattern.enddate.split('/')[1];
        var endYear = searchPattern.enddate.split('/')[2];

        startdate = new Date(moment({ y: startYear, m: startMonth, d: startDay }).format('YYYY-MM-DD HH:mm:ss'));
        enddate = new Date(moment({ y: endYear, m: endMonth, d: endDay }).format('YYYY-MM-DD HH:mm:ss'));

    } else if ((searchPattern.startdate !== undefined && searchPattern.startdate !== '' && searchPattern.startdate !== null)
        &&
        (searchPattern.enddate === undefined || searchPattern.enddate !== '' || searchPattern.enddate !== null)) {
        searchString += 'AND [Order].CreatedDate >= @StartDate ';

        startDay = searchPattern.startdate.split('/')[0];
        startMonth = searchPattern.startdate.split('/')[1];
        startYear = searchPattern.startdate.split('/')[2];

        startdate = new Date(moment({ y: startYear, m: startMonth, d: startDay }).format('YYYY-MM-DD HH:mm:ss'));

    } else if((searchPattern.enddate !== undefined && searchPattern.enddate !== '' && searchPattern.enddate !== null)
        &&
        (searchPattern.startdate === undefined || searchPattern.startdate !== '' || searchPattern.startdate !== null)) {
        searchString += 'AND [Order].CreatedDate <= @EndDate ';

        endDay = searchPattern.enddate.split('/')[0];
        endMonth = searchPattern.enddate.split('/')[1];
        endYear = searchPattern.enddate.split('/')[2];

        enddate = new Date(moment({ y: endYear, m: endMonth, d: endDay }).format('YYYY-MM-DD HH:mm:ss'));
    }

    if (searchPattern.status !== undefined && searchPattern.status !== '' && searchPattern.status !== null
        && searchPattern.status !== '0') {
        searchString += 'AND OrderStatus = @Status ';
    }
    if (searchPattern.seller !== undefined && searchPattern.seller !== '' && searchPattern.seller !== null) {
        searchString += "AND (Account.AccountName LIKE '%@Seller%' OR UserProfile.FullName LIKE '%@Seller%' ";
    }

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, searchPattern.storeid)
        .input('OrderCode', sql.NVarChar, searchPattern.ordercode)
        .input('StartDate', sql.DateTime, startdate)
        .input('EndDate', sql.DateTime, enddate)
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
                updateddate: moment(value.UpdatedDate).format('DD/MM/YYYY HH:mm:ss'),
                orderstatus: value.OrderStatus,
                selleraccount: value.SellerAccount,
                seller: value.Seller,
                commemt: value.Comment,
                paymentmethod: value.PaymentMethod
            });
        });

        response.model.orderinfo = orders;
    }
    return response;
};


//get orders detail
exports.getOrderDetail = async (info) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, info.storeid)
        .input('OrderId', sql.BigInt, info.orderid)
        .query(orderSqlCmd.getOrderDetail);

    if (result.recordset.length >= 0) {
        var orders = [];
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;

        result.recordset.forEach(function (value) {
            orders.push({
                id: security.encrypt(value.Id + '_' + security.serverKey()),
                productname: value.ProductName,
                productcode: value.ProductCode,
                amount: value.Amount,
                price: value.Price,
                total: value.Total
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
        .input('PaymentId', sql.Int, orderInfo.paymentId)
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

//update order comment
exports.updateOrderComment = async (info) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('OrderId', sql.BigInt, info.orderid)
        .input('StoreId', sql.BigInt, info.storeid)
        .input('Comment', sql.NVarChar, info.comment)
        .query(orderSqlCmd.updateOrderComment);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.orderinfo = security.encrypt(info.orderid + '_' + security.serverKey());
    }

    return response;
};

//update order payment
exports.updateOrderPayment = async (info) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('OrderId', sql.BigInt, info.orderid)
        .input('StoreId', sql.BigInt, info.storeid)
        .input('PaymentId', sql.Int, info.paymentId)
        .query(orderSqlCmd.updateOrderPayment);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.orderinfo = security.encrypt(info.orderid + '_' + security.serverKey());
    }

    return response;
};

//remove order
exports.removeOrder = async (info) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('OrderId', sql.BigInt, info.orderid)
        .input('StoreId', sql.BigInt, info.storeid)
        .query(orderSqlCmd.removeOrder);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
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

    if (result.recordset.length >= 0) {
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
            updateddate: moment(result.recordset[0].UpdatedDate).format('DD/MM/YYYY HH:mm:ss'),
            orderstatus: result.recordset[0].OrderStatus,
            selleraccount: result.recordset[0].SellerAccount,
            seller: result.recordset[0].Seller,
            commemt: result.recordset[0].Comment,
            paymentmethod: result.recordset[0].PaymentMethod
        };
    }
    return response;
};
