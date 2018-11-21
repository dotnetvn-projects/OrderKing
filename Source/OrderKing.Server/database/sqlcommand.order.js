var defineProperty = function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
};

//get order list by store
defineProperty('getOrderListByStore', `
    SELECT [Order].Id, Store.StoreName, [Order].OrderCode, [Order].SeqNum,
           [Order].TotalPrice, [Order].TotalAmount,[Order].CreatedDate,
           [Order].PrintedDate, [Order].Comment,
           CASE [Order].[OrderStatus] 
               WHEN 1 THEN N'Ho?n Th?nh' 
               WHEN 2 THEN N'H?y' 
               WHEN 3 THEN N'Ch?a Ho?n Th?nh' END AS OrderStatus,
          Account.AccountName AS SellerAccount, UserProfile.FullName AS Seller 
    FROM [Order]
    INNER JOIN Account ON [Order].SellerId = Account.Id
    INNER JOIN UserProfile ON Account.Id = UserProfile.AccountId
	INNER JOIN Store ON Store.Id = [Order].StoreId
    WHERE StoreId = @StoreId {0}
    ORDER BY CreatedDate DESC`);

//create new order
defineProperty('createNewOrder', `
    INSERT INTO [Order] (OrderCode, SeqNum, SellerId, StoreId, 
                TotalPrice, TotalAmount, CreatedDate, OrderStatus)
          VALUES ('0', @SeqNum, @SellerId, @StoreId, @TotalPrice, @TotalAmount, GETDATE(), @OrderStatus)
`);

//update ordercode
defineProperty('updateOrderCode', `
    UPDATE [Order] SET OrderCode = @OrderCode WHERE Id = @OrderId
`);

//create order detail
defineProperty('createOrderDetail', `
    INSERT INTO [OrderDetail] (OrderId, ProductId, Amount, Price)
        VALUES (@OrderId, @ProductId, @Amount, @Price)
    SELECT SCOPE_IDENTITY() AS OrderDetailId
`);

//update status
defineProperty('updateOrderStatus', `
    UPDATE [Order] SET OrderStatus = @Status WHERE StoreId = @StoreId  Id = @OrderId
`);

//get ordrer info
defineProperty('getOrderInfo', `
     SELECT [Order].Id, Store.StoreName, [Order].OrderCode, [Order].SeqNum,
           [Order].TotalPrice, [Order].TotalAmount,[Order].CreatedDate,
           [Order].PrintedDate, [Order].Comment,
           CASE [Order].[OrderStatus] 
               WHEN 1 THEN N'Ho?n Th?nh' 
               WHEN 2 THEN N'H?y' 
               WHEN 3 THEN N'Ch?a Ho?n Th?nh' END AS OrderStatus,
          Account.AccountName AS SellerAccount, UserProfile.FullName AS Seller 
    FROM [Order]
    INNER JOIN Account ON [Order].SellerId = Account.Id
    INNER JOIN UserProfile ON Account.Id = UserProfile.AccountId
	INNER JOIN Store ON Store.Id = [Order].StoreId
    WHERE StoreId = @StoreId AND [Order].Id = @OrderId
`);