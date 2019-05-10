const categoryResponse = require('../models/category/model.category');
const productResponse = require('../models/product/model.product');
const auditSqlCmd = require('../database/sqlcommand.audit');
const status = require('../resources/resource.api.status');
const { poolPromise, sql } = require('../database/dbconnection');
const security = require('../services/service.security');
const moment = require('moment');

//get audit list in store
exports.getAuditList = async (storeId) => {
    categoryResponse.model.statusmessage = status.common.failed;
    categoryResponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    var result = await pool.request()
        .input('StoreId', sql.BigInt, storeId)
        .query(catalogSqlCmd.getCategoryInStore);

    if (result.recordset.length > 0) {
        categoryResponse.model.statusmessage = status.common.suscess;
        categoryResponse.model.responsecode = status.common.suscesscode;
        var categories = [];
        result.recordset.forEach(function (value) {
            categories.push({
                categoryid: security.encrypt(value.Id + '_' + security.serverKey()),
                categoryname: value.Name,
                productamount: value.ProductAmount,
                createddate: moment(value.CreatedDate).format('DD/MM/YYYY')
            });
        });

        categoryResponse.model.category = categories;
    }

    return categoryResponse;
};
