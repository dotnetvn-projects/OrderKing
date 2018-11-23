var defineProperty = function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
};

//create new category
defineProperty('createCategory', `
    INSERT INTO Category(Image, StoreId, Name, CreatedDate)
    VALUES (@Image, @StoreId, @Name, GETDATE());
    SELECT SCOPE_IDENTITY() AS CategoryId
`);

//update category
defineProperty('updateCategory', `
    UPDATE Category
    SET Name = @Name, Image = @Image
    WHERE Id = @Id AND StoreId = @StoreId
`);

//delete category
defineProperty('deactivateCategory', `
    UPDATE Category SET IsActived = 0 WHERE Id = @Id AND StoreId = @StoreId
`);

//get category in store
defineProperty('getCategoryInStore', 
    `SELECT Id, Name, CreatedDate
     FROM Category WHERE StoreId =@StoreId AND IsActived = 1
`);

//create product
defineProperty('createProduct', `
    INSERT INTO Product(Name, Description, StoreId, CategoryId, CreatedDate, Price, IsActived)
    VALUES(@Name, @Description, @StoreId, @CategoryId, GETDATE(), @Price, 1)
`);

//create product
defineProperty('updateProduct', `
    UPDATE Product 
    SET Name = @Name, Description = @Description, 
        CategoryId = @CategoryId, Price = @Price)
    WHERE Id = @Id and StoreId = @StoreId
`);

//create product image
defineProperty('createProductImage', `
    INSERT INTO ProductImage(ProductId, Image, IsDefault) VALUES (@ProductId, @Image, @IsDefault)
`);

//set default image display for product
defineProperty('setImageDefault',
    `UPDATE ProductImage SET IsDefault = 1 WHERE Id = @Id`);

//remove product image
defineProperty('removeProductImage',
    `DELETE FROM ProductImage WHERE Id = @Id`);

//deactive product
defineProperty('deactiveProduct', `
    UPDATE Product SET IsActived = 0 WHERE Id = @Id and StoreId = @StoreId
`);

//get product in store
defineProperty('getProductInStore', `
    SELECT Product.Id, Product.[Name], Product.Description, Product.CreatedDate,
           Product.Price, Category.[Name], Store.StoreName
    FROM Product INNER JOIN Store ON Store.Id = Product.StoreId
    INNER JOIN Category ON Product.CategoryId = Category.Id AND Store.Id = Category.StoreId
    WHERE Product.StoreId = @StoreId AND Product.IsActived = 1 AND Category.IsActived =1
    ORDER BY Product.CreatedDate DESC
`);

//get product in store by category
defineProperty('getProductInStoreByCate', `
    SELECT Product.Id, Product.[Name], Product.Description, Product.CreatedDate,
           Product.Price, Category.[Name], Store.StoreName
    FROM Product INNER JOIN Store ON Store.Id = Product.StoreId
    INNER JOIN Category ON Product.CategoryId = Category.Id AND Store.Id = Category.StoreId
    WHERE Product.StoreId = @StoreId AND Category.Id = @CateId
          AND Product.IsActived = 1 AND Category.IsActived =1
    ORDER BY Product.CreatedDate DESC
`);

//get product image default
defineProperty('getProductImageDefault',
    `SELECT Image From ProductImage 
     WHERE ProductId = @ProductId AND IsDefault = 1`);