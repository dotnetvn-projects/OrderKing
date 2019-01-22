const { poolPromise, sql } = require('../database/dbconnection');
const response = require('../models/payment/model.paymentMethod');
const status = require('../resources/resource.api.status');
const security = require('../services/service.security');
const paymentSqlCmd = require('../database/sqlcommand.payment');

exports.getPaymentMethods = async () => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .query(paymentSqlCmd.getPaymentMethods);

    if (result.recordset.length >= 0) {
        var methods = [];
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;

        result.recordset.forEach(function (value) {
            methods.push({
                id: security.encrypt(value.Id + '_' + security.serverKey()),
                paymentmethod: value.PaymentMethod
            });
        });

        response.model.paymentmethod = methods;
    }
    return response;
};