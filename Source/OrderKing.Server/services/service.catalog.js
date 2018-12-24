const categoryResponse = require('../models/category/model.category');
const productResponse = require('../models/product/model.product');
const catalogSqlCmd = require('../database/sqlcommand.catalog');
const status = require('../resources/resource.api.status');
const { poolPromise, sql } = require('../database/dbconnection');
const security = require('../services/service.security');

//create new category
exports.createCatagory = async (categoryobject) => {
    categoryResponse.model.statusmessage = status.common.failed;
    categoryResponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, categoryobject.storeId)
        .input('Name', sql.NVarChar, categoryobject.name)
        .input("Image", sql.VarBinary, buf)
        .query(catalogSqlCmd.createCategory);

    if (result.recordset.length > 0) {
        categoryResponse.model.statusmessage = status.common.suscess;
        categoryResponse.model.responsecode = status.common.suscesscode;
        categoryResponse.model.category = {
            id: security.encrypt(result.recordset[0].CategoryId + '_' + security.serverKey()),
            name: categoryobject.name
        };
    }

    return categoryResponse;
};

//update category
exports.updateCatagory = async (categoryobject) => {
    categoryResponse.model.statusmessage = status.common.failed;
    categoryResponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, categoryobject.storeId)
        .input('Name', sql.NVarChar, categoryobject.name)
        .input('Id', sql.BigInt, categoryobject.id)
        .query(catalogSqlCmd.updateCategory);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        categoryResponse.model.statusmessage = status.common.suscess;
        categoryResponse.model.responsecode = status.common.suscesscode;
        categoryResponse.model.category = {
            id: security.encrypt(categoryobject.id + '_' + security.serverKey()),
            name: categoryobject.name
        };
    }

    return categoryResponse;
};

//update category image
exports.updateCatagoryImage = async (categoryobject) => {
    categoryResponse.model.statusmessage = status.common.failed;
    categoryResponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('Id', sql.BigInt, categoryobject.id)
        .input('Image', sql.VarBinary, categoryobject.image)
        .input('StoreId', sql.BigInt, categoryobject.storeId)
        .query(catalogSqlCmd.updateCategoryImage);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        categoryResponse.model.statusmessage = status.common.suscess;
        categoryResponse.model.responsecode = status.common.suscesscode;
    }

    return categoryResponse;
};

//delete category
exports.deactivateCategory = async (categoryobject) => {
    categoryResponse.model.statusmessage = status.common.failed;
    categoryResponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('Id', sql.BigInt, categoryobject.id)
        .input('StoreId', sql.BigInt, categoryobject.storeId)
        .query(catalogSqlCmd.deactivateCategory);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        categoryResponse.model.statusmessage = status.common.suscess;
        categoryResponse.model.responsecode = status.common.suscesscode;
    }

    return categoryResponse;
};

//get category list in store
exports.getCategoryInStore = async (storeId) => {
    categoryResponse.model.statusmessage = status.common.failed;
    categoryResponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    var result = await pool.request()
        .input('StoreId', sql.BigInt, storeId)
        .query(catalogSqlCmd.getCategoryInStore);

    if (result.recordset.length > 0) {
        var categories = [];
        result.recordset.forEach(function (value) {
            categories.push({
                categoryid: security.encrypt(value.Id + '_' + security.serverKey()),
                categoryname: value.Name,
                createddate: value.CreatedDate
            });
        });

        categoryResponse.model.category = categories;
    }

    return categoryResponse;
};

//create product
exports.createProduct = async (productobject) => {
    productResponse.model.statusmessage = status.common.failed;
    productResponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, productobject.storeId)
        .input('Name', sql.NVarChar, productobject.name)
        .input('Image', sql.VarBinary, productobject.image)
        .input("Description", sql.NVarChar, productobject.description)
        .input("CategoryId", sql.BigInt, productobject.categoryId)
        .input("Price", sql.Int, productobject.price)
        .query(catalogSqlCmd.createProduct);

    if (result.recordset.length > 0) {
        productResponse.model.statusmessage = status.common.suscess;
        productResponse.model.responsecode = status.common.suscesscode;
        productResponse.model.product = {
            id: security.encrypt(result.recordset[0].ProductId + '_' + security.serverKey()),
            name: productobject.name,
            description: productobject.description,
            price: productobject.price
        };
    }

    return productResponse;
};

//update product image
exports.updateProductImage = async (productobject) => {
    categoryResponse.model.statusmessage = status.common.failed;
    categoryResponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('Id', sql.BigInt, productobject.id)
        .input('Image', sql.VarBinary, productobject.image)
        .input('StoreId', sql.BigInt, productobject.storeId)
        .query(catalogSqlCmd.updateProductImage);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        categoryResponse.model.statusmessage = status.common.suscess;
        categoryResponse.model.responsecode = status.common.suscesscode;
    }

    return categoryResponse;
};


//update product
exports.updateProduct = async (productobject) => {
    productResponse.model.statusmessage = status.common.failed;
    productResponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, productobject.storeId)
        .input('Name', sql.NVarChar, productobject.name)
        .input("Description", sql.NVarChar, productobject.description)
        .input("CategoryId", sql.BigInt, productobject.categoryId)
        .input("Price", sql.Int, productobject.price)
        .input('Id', sql.BigInt, categoryobject.id)
        .query(catalogSqlCmd.updateProduct);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        productResponse.model.statusmessage = status.common.suscess;
        productResponse.model.responsecode = status.common.suscesscode;
        productResponse.model.product = {
            id: security.encrypt(security.encrypt(productobject.id + '_' + security.serverKey())),
            name: productobject.name,
            description: productobject.description,
            price: productobject.price
        };
    }

    return productResponse;
};

//delete product
exports.deactivateCategory = async (productobject) => {
    productResponse.model.statusmessage = status.common.failed;
    productResponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('Id', sql.BigInt, productobject.id)
        .input('StoreId', sql.BigInt, productobject.storeId)
        .query(catalogSqlCmd.deactiveProduct);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        productResponse.model.statusmessage = status.common.suscess;
        productResponse.model.responsecode = status.common.suscesscode;
    }

    return productResponse;
};


//get product list in store
exports.getProductsInStore = async (storeId) => {
    productResponse.model.statusmessage = status.common.failed;
    productResponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    var result = await pool.request()
        .input('StoreId', sql.BigInt, storeId)
        .query(catalogSqlCmd.getProductsInStore);

    if (result.recordset.length > 0) {
        var products = [];
        result.recordset.forEach(function (value) {
            products.push({
                categoryName: value.CategoryName,
                id: security.encrypt(value.Id + '_' + security.serverKey()),
                name: value.Name,
                createdDate: value.CreatedDate,
                description: value.Description,
                storeName: value.StoreName,
                price: value.Price
            });
        });

        productResponse.model.product = products;
    }

    return productResponse;
};

//get product list in store by cate
exports.getProductsInStoreByCate = async (productobject) => {
    productResponse.model.statusmessage = status.common.failed;
    productResponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    var result = await pool.request()
        .input('StoreId', sql.BigInt, productobject.storeId)
        .input('CategoryId', sql.BigInt, productobject.categoryId)
        .query(catalogSqlCmd.getProductsInStoreByCate);

    if (result.recordset.length > 0) {
        var products = [];
        result.recordset.forEach(function (value) {
            products.push({
                categoryName: value.CategoryName,
                id: security.encrypt(value.Id + '_' + security.serverKey()),
                name: value.Name,
                createdDate: value.CreatedDate,
                description: value.Description,
                storeName: value.StoreName,
                price: value.Price
            });
        });

        productResponse.model.product = products;
    }

    return productResponse;
};

//get product image
exports.getProductImage = async (productId) => {
    productResponse.model.statusmessage = status.common.failed;
    productResponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input("Id", sql.BigInt, productId)
        .query(userSqlCmd.getProductImage);

    if (result.recordset.length > 0) {
        productResponse.model.statusmessage = status.common.suscess;
        productResponse.model.responsecode = status.common.suscesscode;
        productResponse.model.product = result.recordset[0].Image;
    }
    return response;
};

//get category image
exports.getCategoryImage = async (categoryId) => {
    categoryResponse.model.statusmessage = status.common.failed;
    categoryResponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input("Id", sql.BigInt, categoryId)
        .query(userSqlCmd.getCategoryImage);

    if (result.recordset.length > 0) {
        categoryResponse.model.statusmessage = status.common.suscess;
        categoryResponse.model.responsecode = status.common.suscesscode;
        categoryResponse.model.category = result.recordset[0].Image;
    }
    return response;
};