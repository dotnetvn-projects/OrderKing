var defineProperty = function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
};

//get order list by store
//status: 1 :completed, 2: cancel, 3 not yet processed
defineProperty('getOrderListByStore', `
    SELECT [Order].Id, Store.StoreName, [Order].OrderCode, [Order].SeqNum,
           [Order].TotalPrice, [Order].TotalAmount,[Order].CreatedDate,
           [Order].UpdatedDate, [Order].Comment,
           [Order].[OrderStatus], Account.AccountName AS SellerAccount, UserProfile.FullName AS Seller 
    FROM [Order]
    INNER JOIN Account ON [Order].SellerId = Account.Id
    INNER JOIN UserProfile ON Account.Id = UserProfile.AccountId
	INNER JOIN Store ON Store.Id = [Order].StoreId
    WHERE StoreId = @StoreId {0}
    ORDER BY CreatedDate DESC`);

//create new order
defineProperty('createNewOrder', `
    INSERT INTO [Order] (OrderCode, SeqNum, SellerId, StoreId, 
                TotalPrice, TotalAmount, CreatedDate, OrderStatus, UpdatedDate)
          VALUES ('0', @SeqNum, @SellerId, @StoreId, @TotalPrice, @TotalAmount, GETDATE(), @OrderStatus, GETDATE())
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
    UPDATE [Order] SET OrderStatus = @Status, UpdatedDate = GETDATE() WHERE StoreId = @StoreId  Id = @OrderId
`);

//get ordrer info
defineProperty('getOrderInfo', `
     SELECT [Order].Id, Store.StoreName, [Order].OrderCode, [Order].SeqNum,
           [Order].TotalPrice, [Order].TotalAmount,[Order].CreatedDate,
           [Order].UpdatedDate, [Order].Comment,
           [Order].[OrderStatus],
          Account.AccountName AS SellerAccount, UserProfile.FullName AS Seller 
    FROM [Order]
    INNER JOIN Account ON [Order].SellerId = Account.Id
    INNER JOIN UserProfile ON Account.Id = UserProfile.AccountId
	INNER JOIN Store ON Store.Id = [Order].StoreId
    WHERE StoreId = @StoreId AND [Order].Id = @OrderId
`);

//get order detail list
defineProperty('getOrderDetail', `
    SELECT OrderDetail.Id, Product.[Name], Product.Code, OrderDetail.Amount, 
          OrderDetail.Price, (OrderDetail.Price * OrderDetail.Amount) AS Total
    FROM [OrderDetail] 
    INNER JOIN Order ON [Order].Id = OrderDetail.OrderId
	INNER JOIN Product ON Product.Id = OrderDetail.ProductId
    WHERE OrderDetail.OrderId = @OrderId`);