const response = require('../models/category/model.category');
const catalogSqlCmd = require('../database/sqlcommand.catalog');
const status = require('../resources/resource.api.status');
const { poolPromise, sql } = require('../database/dbconnection');
const moment = require('moment');
const security = require('../services/service.security');

//create new category
exports.createCatagory = async (categoryobject) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;
    var buf = Buffer.from(categoryobject.image, 'base64');

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, categoryobject.storeId)
        .input('Name', sql.NVarChar, categoryobject.name)
        .input("Image", sql.VarBinary, buf)
        .query(catalogSqlCmd.createCategory);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.category = categoryobject;
    }

    return response;
};

//update category
exports.updateCatagory = async (categoryobject) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;
    var buf = Buffer.from(categoryobject.image, 'base64');

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, categoryobject.storeId)
        .input("Image", sql.VarBinary, buf)
        .input('Name', sql.NVarChar, categoryobject.name)
        .input('Id', sql.BigInt, categoryobject.id)
        .query(catalogSqlCmd.updateCategory);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        response.model.category = categoryobject;
    }

    return response;
};

//delete category
exports.deactivateCategory = async (categoryobject) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('Id', sql.BigInt, categoryobject.id)
        .input('StoreId', sql.BigInt, categoryobject.storeId)
        .query(catalogSqlCmd.deactivateCategory);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
    }

    return response;
};

//get category list in store
exports.getCategoryInStore = async (storeId) => {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    var result = await pool.request()
        .input('StoreId', sql.BigInt, storeId)
        .query(catalogSqlCmd.getCategoryInStore);

    if (result.recordset.length > 0) {
        var categories = [];
        result.recordset.forEach(function (value) {
            categories.push({
                categoryId: security.encrypt(value.Id),
                categoryName: value.Name,
                createdDate: value.CreatedDate
            });
        });

        response.model.category = categories;
    }

    return response;
};