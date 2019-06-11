const categoryResponse = require('../models/category/model.category');
const productResponse = require('../models/product/model.product');
const catalogSqlCmd = require('../database/sqlcommand.catalog');
const status = require('../resources/resource.api.status');
const { poolPromise, sql } = require('../database/dbconnection');
const security = require('../services/service.security');
const moment = require('moment');
const format = require('string-format');
const auditHandler = require('../eventHandlers/event.handler.audit');

//generate product code
function generateProductCode(id) {
    if (id < 10) {
        return 'SP-#00' + id;
    } else if (id < 100 && id > 9) {
        return 'SP-#0' + id;
    }
    else {
        return 'SP-#' + id;
    }
}

//create new category
exports.createCatagory = async (categoryobject) => {
    categoryResponse.model.statusmessage = status.common.failed;
    categoryResponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input('StoreId', sql.BigInt, categoryobject.storeId)
        .input('Name', sql.NVarChar, categoryobject.name)
        .input("Image", sql.VarBinary, categoryobject.image)
        .query(catalogSqlCmd.createCategory);

    if (result.recordset.length > 0) {
        categoryResponse.model.statusmessage = status.common.suscess;
        categoryResponse.model.responsecode = status.common.suscesscode;
        categoryResponse.model.category = {
            categoryid: security.encrypt(result.recordset[0].CategoryId + '_' + security.serverKey()),
            categoryname: categoryobject.name
        };

        auditHandler.fire("insertAudit", categoryobject.storeId,
            categoryobject.accessToken, "Tạo danh mục" + categoryobject.name.toUpperCase(), categoryobject.appName);
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
            categoryid: security.encrypt(categoryobject.id + '_' + security.serverKey()),
            categoryname: categoryobject.name
        };

        auditHandler.fire("insertAudit", categoryobject.storeId,
            categoryobject.accessToken, "Cập nhật danh mục " + categoryobject.name.toUpperCase(), categoryobject.appName);
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

        var cate = await module.exports.getCategoryById({ id: categoryobject.id }, false);
        auditHandler.fire("insertAudit", categoryobject.storeId,
            categoryobject.accessToken, "Cập nhật ảnh cho danh mục " + cate.categoryname.toUpperCase(), categoryobject.appName);
    }

    return categoryResponse;
};

//delete category
exports.deactivateCategory = async (categoryobject) => {
    categoryResponse.model.statusmessage = status.common.failed;
    categoryResponse.model.responsecode = status.common.failedcode;

    var cate = await module.exports.getCategoryById({ id: categoryobject.id }, false);

    const pool = await poolPromise;
    const result = await pool.request()
        .input('Id', sql.BigInt, categoryobject.id)
        .input('StoreId', sql.BigInt, categoryobject.storeId)
        .query(catalogSqlCmd.deactivateCategory);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        categoryResponse.model.statusmessage = status.common.suscess;
        categoryResponse.model.responsecode = status.common.suscesscode;

        
        auditHandler.fire("insertAudit", categoryobject.storeId,
            categoryobject.accessToken, "Xóa danh mục " + cate.categoryname.toUpperCase(), categoryobject.appName);
    }

    return categoryResponse;
};

//get category list in store
exports.getCategoryInStore = async (categoryobject) => {
    categoryResponse.model.statusmessage = status.common.failed;
    categoryResponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    var result = await pool.request()
        .input('StoreId', sql.BigInt, categoryobject.storeId)
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

        auditHandler.fire("insertAudit", categoryobject.storeId,
            categoryobject.accessToken, "Truy vấn danh sách danh mục từ cửa hàng", categoryobject.appName);
    }

    return categoryResponse;
};

//get category in store by Id
exports.getCategoryById = async (categoryobject, allowLog = true) => {
    categoryResponse.model.statusmessage = status.common.failed;
    categoryResponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    var result = await pool.request()
        .input('Id', sql.BigInt, categoryobject.id)
        .query(catalogSqlCmd.getCategoryById);

    if (result.recordset.length > 0) {
        categoryResponse.model.statusmessage = status.common.suscess;
        categoryResponse.model.responsecode = status.common.suscesscode;          
        categoryResponse.model.category = {
            categoryid: security.encrypt(result.recordset[0].Id + '_' + security.serverKey()),
            categoryname: result.recordset[0].Name,
            createddate: moment(result.recordset[0].CreatedDate).format('DD/MM/YYYY')
        };

        if (allowLog) {
            auditHandler.fire("insertAudit", categoryobject.storeId,
                categoryobject.accessToken, "Truy vấn danh mục " + result.recordset[0].Name.toUpperCase(), categoryobject.appName);
        }
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
        .input('Code', sql.NVarChar, productobject.code)
        .input('Name', sql.NVarChar, productobject.name)
        .input('Image', sql.VarBinary, productobject.image)
        .input("Description", sql.NVarChar, productobject.description)
        .input('InStock', sql.Int, productobject.inStock)
        .input("CategoryId", sql.BigInt, productobject.categoryId)
        .input("Price", sql.Int, productobject.price)
        .query(catalogSqlCmd.createProduct);

    if (result.recordset.length > 0) {
        var productId = result.recordset[0].ProductId;
        var productCode = generateProductCode(productId);

        result = await pool.request()
            .input('Code', sql.NVarChar, productCode)
            .input('Id', sql.BigInt, productCode)
            .query(catalogSqlCmd.updateProductCode);

        productResponse.model.statusmessage = status.common.suscess;
        productResponse.model.responsecode = status.common.suscesscode;
        productResponse.model.product = {
            productid: security.encrypt(result.recordset[0].ProductId + '_' + security.serverKey()),
            productname: productobject.name,
            description: productobject.description,
            price: productobject.price
        };

        auditHandler.fire("insertAudit", productobject.storeId,
            productobject.accessToken, "Tạo mới mặt hàng " + productobject.name.toUpperCase(), productobject.appName);
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

        var pro = await module.exports.getProductInStoreById({ id: productobject.id, storeId: productobject.storeId }, false);
        auditHandler.fire("insertAudit", productobject.storeId,
            productobject.accessToken, "Cập nhật hình ảnh của mặt hàng " + pro.productname.toUpperCase(), productobject.appName);
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
        .input('InStock', sql.Int, productobject.inStock)
        .input("CategoryId", sql.BigInt, productobject.categoryId)
        .input("Price", sql.Int, productobject.price)
        .input('Id', sql.BigInt, productobject.id)
        .query(catalogSqlCmd.updateProduct);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        productResponse.model.statusmessage = status.common.suscess;
        productResponse.model.responsecode = status.common.suscesscode;
        productResponse.model.product = {
            productid: security.encrypt(productobject.id + '_' + security.serverKey()),
            productname: productobject.name,
            description: productobject.description,
            price: productobject.price
        };

        auditHandler.fire("insertAudit", productobject.storeId,
            productobject.accessToken, "Cập nhật thông tin mặt hàng " + productobject.name.toUpperCase(), productobject.appName);
    }

    return productResponse;
};

//deactive product
exports.deactivateProduct = async (productObject) => {
    productResponse.model.statusmessage = status.common.failed;
    productResponse.model.responsecode = status.common.failedcode;
    var pro = await module.exports.getProductInStoreById({ id: productobject.id, storeId: productobject.storeId }, false);

    const pool = await poolPromise;
    const result = await pool.request()
        .input('Id', sql.BigInt, productObject.id)
        .input('StoreId', sql.BigInt, productObject.storeId)
        .query(catalogSqlCmd.deactiveProduct);

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] !== 0) {
        productResponse.model.statusmessage = status.common.suscess;
        productResponse.model.responsecode = status.common.suscesscode;

        auditHandler.fire("insertAudit", productobject.storeId,
            productobject.accessToken, "Xóa mặt hàng " + pro.productname.toUpperCase(), productobject.appName);
    }

    return productResponse;
};

//get product list in store
exports.getProductsInStore = async (productobject) => {
    productResponse.model.statusmessage = status.common.failed;
    productResponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    var result = await pool.request()
        .input('StoreId', sql.BigInt, productobject.storeId)
        .query(catalogSqlCmd.getProductsInStore);

    if (result.recordset.length >= 0) {
        productResponse.model.statusmessage = status.common.suscess;
        productResponse.model.responsecode = status.common.suscesscode;

        var products = [];
        result.recordset.forEach(function (value) {
            products.push({
                categoryname: value.CategoryName,
                productid: security.encrypt(value.Id + '_' + security.serverKey()),
                categoryid: security.encrypt(value.CategoryId + '_' + security.serverKey()),
                productname: value.Name,
                createddate: moment(value.CreatedDate).format('DD/MM/YYYY'),
                description: value.Description,
                storename: value.StoreName,
                instock: value.InStock,
                price: value.Price,
                code: value.Code
            });
        });

        productResponse.model.product = products;

        auditHandler.fire("insertAudit", productobject.storeId,
            productobject.accessToken, "Truy vấn danh sách mặt hàng trong cửa hàng", productobject.appName);
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

    if (result.recordset.length >= 0) {
        productResponse.model.statusmessage = status.common.suscess;
        productResponse.model.responsecode = status.common.suscesscode;

        var products = [];
        result.recordset.forEach(function (value) {
            products.push({
                categoryname: value.CategoryName,
                productid: security.encrypt(value.Id + '_' + security.serverKey()),
                categoryid: security.encrypt(value.CategoryId + '_' + security.serverKey()),
                productname: value.Name,
                createddate: moment(value.CreatedDate).format('DD/MM/YYYY'),
                description: value.Description,
                storename: value.StoreName,
                instock: value.InStock,
                price: value.Price,
                code: value.Code
            });
        });

        productResponse.model.product = products;

        var cate = await module.exports.getCategoryById({ id: productobject.categoryId }, false);
        auditHandler.fire("insertAudit", productobject.storeId,
            productobject.accessToken,
            format("Truy vấn danh sách mặt hàng của danh mục {0} trong cửa hàng", cate.categoryname.toUpperCase()),
            productobject.appName);
    }

    return productResponse;
};

//get product in store by id
exports.getProductInStoreById = async (productobject, allowLog = true) => {
    productResponse.model.statusmessage = status.common.failed;
    productResponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    var result = await pool.request()
        .input('StoreId', sql.BigInt, productobject.storeId)
        .input('Id', sql.BigInt, productobject.productId)
        .query(catalogSqlCmd.getProductById);

    if (result.recordset.length > 0) {
        productResponse.model.statusmessage = status.common.suscess;
        productResponse.model.responsecode = status.common.suscesscode;

        productResponse.model.product = {
            categoryname: result.recordset[0].CategoryName,
            productid: security.encrypt(result.recordset[0].Id + '_' + security.serverKey()),
            categoryid: security.encrypt(result.recordset[0].CategoryId + '_' + security.serverKey()),
            productname: result.recordset[0].Name,
            createddate: moment(result.recordset[0].CreatedDate).format('DD/MM/YYYY'),
            description: result.recordset[0].Description,
            storename: result.recordset[0].StoreName,
            instock: result.recordset[0].InStock,
            price: result.recordset[0].Price,
            code: result.recordset[0].Code
        };

        if (allowLog) {
            auditHandler.fire("insertAudit", productobject.storeId,
                productobject.accessToken,
                format("Truy vấn thông tin mặt hàng ", result.recordset[0].Name.toUpperCase()),
                productobject.appName);
        }
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
        .query(catalogSqlCmd.getProductImage);

    if (result.recordset.length > 0) {
        productResponse.model.statusmessage = status.common.suscess;
        productResponse.model.responsecode = status.common.suscesscode;
        productResponse.model.product = result.recordset[0].Image;
    }
    return productResponse;
};

//get category image
exports.getCategoryImage = async (categoryId) => {
    categoryResponse.model.statusmessage = status.common.failed;
    categoryResponse.model.responsecode = status.common.failedcode;

    const pool = await poolPromise;
    const result = await pool.request()
        .input("Id", sql.BigInt, categoryId)
        .query(catalogSqlCmd.getCategoryImage);

    if (result.recordset.length > 0) {
        categoryResponse.model.statusmessage = status.common.suscess;
        categoryResponse.model.responsecode = status.common.suscesscode;
        categoryResponse.model.category = result.recordset[0].Image;
    }
    return categoryResponse;
};