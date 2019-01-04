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
    SET Name = @Name
    WHERE Id = @Id AND StoreId = @StoreId
`);

//update category image
defineProperty('updateCategoryImage', `
    UPDATE Category
    SET Image = @Image
    WHERE Id = @Id AND StoreId = @StoreId
`);

//delete category
defineProperty('deactivateCategory', `
    UPDATE Category SET IsActived = 0 WHERE Id = @Id AND StoreId = @StoreId
`);

//get category in store
defineProperty('getCategoryInStore', 
    `SELECT Category.Id, Category.Name, Category.CreatedDate, COUNT(PRODUCT.Id) AS ProductAmount
     FROM Category 
     LEFT JOIN PRODUCT ON Product.CategoryId = Category.Id 
     WHERE Category.StoreId =@StoreId AND Category.IsActived = 1 
     GROUP BY Category.Id, Category.Name, Category.CreatedDate
     ORDER BY CreatedDate DESC
`);

//get category by id
defineProperty('getCategoryById',
    `SELECT Id, Name, CreatedDate
     FROM Category WHERE Id =@Id
`);

//create product
defineProperty('createProduct', `
    INSERT INTO Product(Name, Image, Description, InStock, StoreId, CategoryId, CreatedDate, Price, IsActived)
    VALUES(@Name, @Image, @Description, @InStock @StoreId, @CategoryId, GETDATE(), @Price, 1)
    SELECT SCOPE_IDENTITY() AS ProductId
`);

//update product
defineProperty('updateProduct', `
    UPDATE Product 
    SET Name = @Name, Description = @Description, 
        CategoryId = @CategoryId, Price = @Price,
        InStock = @InStock
    WHERE Id = @Id and StoreId = @StoreId
`);

//update product image
defineProperty('updateProductImage', `
    UPDATE Product
    SET Image = @Image
    WHERE Id = @Id AND StoreId = @StoreId
`);

//create product image
defineProperty('createProductImage', `
    INSERT INTO ProductImage(ProductId, Image) VALUES (@ProductId, @Image)
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
defineProperty('getProductsInStore', `
    SELECT Product.Id, Product.[Name], Product.Description, Product.CreatedDate, Product.InStock,
           Product.Price, Product.CategoryId, Category.[Name] AS CategoryName, Store.StoreName
    FROM Product INNER JOIN Store ON Store.Id = Product.StoreId
    INNER JOIN Category ON Product.CategoryId = Category.Id AND Store.Id = Category.StoreId
    WHERE Product.StoreId = @StoreId AND Product.IsActived = 1 AND Category.IsActived =1
    GROUP BY Product.Id, Product.[Name], Product.Description, Product.CreatedDate,
           Product.Price, Product.CategoryId, Category.[Name], Store.StoreName, Product.InStock
    ORDER BY Product.CreatedDate DESC
`);

//get product in store by category
defineProperty('getProductsInStoreByCate', `
    SELECT Product.Id, Product.[Name], Product.Description, Product.CreatedDate, Product.InStock,
           Product.Price, Product.CategoryId, Category.[Name] AS CategoryName, Store.StoreName
    FROM Product INNER JOIN Store ON Store.Id = Product.StoreId
    INNER JOIN Category ON Product.CategoryId = Category.Id AND Store.Id = Category.StoreId
    WHERE Product.StoreId = @StoreId AND Category.Id = @CategoryId
          AND Product.IsActived = 1 AND Category.IsActived =1
    ORDER BY Product.CreatedDate DESC
`);

//get product info by id
defineProperty('getProductById',
    `SELECT Product.Id, Product.[Name], Product.Description, Product.CreatedDate, Product.InStock,
           Product.Price, Product.CategoryId, Category.[Name] AS CategoryName, Store.StoreName
    FROM Product INNER JOIN Store ON Store.Id = Product.StoreId
    INNER JOIN Category ON Product.CategoryId = Category.Id AND Store.Id = Category.StoreId
    WHERE Product.StoreId = @StoreId AND Product.IsActived = 1
          AND Category.IsActived =1 AND Product.Id = @Id`);

//get product image
defineProperty('getProductImage',
    `SELECT Image From Product WHERE Id = @Id`);

//get product image
defineProperty('getCategoryImage',
    `SELECT Image From Category WHERE Id = @Id`);