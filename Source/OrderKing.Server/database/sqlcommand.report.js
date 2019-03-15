
var defineProperty = function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
};

//summary report for dashboard
defineProperty('SummaryReport',`
    DECLARE @OrderCount BIGINT = (SELECT COUNT([ORDER].Id) FROM [ORDER] WHERE StoreId = @StoreId);

    DECLARE @NewOrderCount BIGINT = (SELECT COUNT([ORDER].Id) 
                                  FROM [ORDER] 
                                  WHERE StoreId = @StoreId 
                                  AND MONTH([ORDER].CreatedDate) = MONTH(GETDATE())
                                  AND YEAR([ORDER].CreatedDate) = YEAR(GETDATE()) 
                                  AND DAY([ORDER].CreatedDate) = DAY(GETDATE()));

    DECLARE @ProductCount BIGINT = (SELECT COUNT(PRODUCT.Id) FROM PRODUCT WHERE StoreId = @StoreId);

    DECLARE @Revenue BIGINT = (SELECT SUM(TotalPrice) FROM [ORDER] WHERE StoreId = @StoreId);
    
    SELECT @OrderCount AS TotalOrder, @NewOrderCount AS TotalNewOrder, @ProductCount AS TotalProduct,
           @Revenue AS TotalRevenue
`);

// get product list that the store sold in day
defineProperty('ProductSoldInDay', `
     SELECT [PRODUCT].Id, [PRODUCT].Name, COUNT([PRODUCT].ID) AS AmountSold,
            SUM([ORDERDETAIL].Amount * [ORDERDETAIL].Price) AS Revenue
     FROM [ORDER] 
     INNER JOIN [ORDERDETAIL] ON [ORDERDETAIL].OrderId = [ORDER].Id
     INNER JOIN PRODUCT ON [ORDERDETAIL].ProductId = [PRODUCT].ID
     WHERE [ORDER].StoreId = @StoreId 
           AND MONTH([ORDER].CreatedDate) = MONTH(GETDATE())
           AND YEAR([ORDER].CreatedDate) = YEAR(GETDATE()) 
           AND DAY([ORDER].CreatedDate) = DAY(GETDATE())
     GROUP BY [PRODUCT].Id, [PRODUCT].Name 
`);
