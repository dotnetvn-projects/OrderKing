const response = require('../models/category/model.category');
const catalogSqlCmd = require('../database/sqlcommand.catalog');
const status = require('../resources/resource.api.status');
const { poolPromise, sql } = require('../database/dbconnection');
const moment = require('moment');

//create new category
exports.createCatagory = async function (categoryobject) {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, categoryobject.storeId)
        .input('Name', sql.NVarChar, categoryobject.name)
        .input('CreatedDate', sql.DateTime, new Date(moment()))
        .input('IsActived', sql.Bit, '1')
        .query(catalogSqlCmd.createCategory);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
        categoryobject.Id = result.recordset[0].CategoryId;
        response.model.category = categoryobject;
    }

    return response;
};

//update category
exports.updateCatagory = async function (categoryobject) {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, categoryobject.storeId)
        .input('Name', sql.NVarChar, categoryobject.name)
        .input('IsActived', sql.Bit, categoryobject.isActived)
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
exports.deleteCatagory = async function (categoryId) {
    response.model.statusmessage = status.common.failed;
    response.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('Id', sql.BigInt, categoryId)
        .query(catalogSqlCmd.deleteCategory);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        response.model.statusmessage = status.common.suscess;
        response.model.responsecode = status.common.suscesscode;
    }

    return response;
};