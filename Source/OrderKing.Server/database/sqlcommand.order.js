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
           [Order].UpdatedDate, [Order].Comment, [PaymentMethod].PaymentMethod,
           [Order].[OrderStatus], Account.AccountName AS SellerAccount, UserProfile.FullName AS Seller 
    FROM [Order]
    INNER JOIN Account ON [Order].SellerId = Account.Id
    INNER JOIN UserProfile ON Account.Id = UserProfile.AccountId
	INNER JOIN Store ON Store.Id = [Order].StoreId
    INNER JOIN PaymentMethod ON [Order].PaymentId = PaymentMethod.Id
    WHERE StoreId = @StoreId {0}
    ORDER BY CreatedDate DESC`);

//create new order
defineProperty('createNewOrder', `
    INSERT INTO [Order] (OrderCode, SeqNum, SellerId, StoreId, PaymentId, 
                TotalPrice, TotalAmount, CreatedDate, OrderStatus, UpdatedDate)
          VALUES ('0', @SeqNum, @SellerId, @StoreId, @PaymentId, @TotalPrice, @TotalAmount, GETDATE(), @OrderStatus, GETDATE())
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
    UPDATE [Order] SET OrderStatus = @Status, UpdatedDate = GETDATE() WHERE StoreId = @StoreId AND Id = @OrderId
`);

//update status
defineProperty('updateOrderComment', `
    UPDATE [Order] SET Comment = @Comment, UpdatedDate = GETDATE() WHERE StoreId = @StoreId AND Id = @OrderId
`);

//update payment
defineProperty('updateOrderPayment', `
    UPDATE [Order] SET PaymentId = @PaymentId, UpdatedDate = GETDATE() WHERE StoreId = @StoreId AND Id = @OrderId
`);

//update status
defineProperty('removeOrder', `
    DELETE FROM [OrderDetail] WHERE OrderId = @OrderId
    DELETE FROM [Order] WHERE StoreId = @StoreId AND Id = @OrderId
`);


//get ordrer info
defineProperty('getOrderInfo', `
     SELECT [Order].Id, Store.StoreName, [Order].OrderCode, [Order].SeqNum,
           [Order].TotalPrice, [Order].TotalAmount,[Order].CreatedDate,
           [Order].UpdatedDate, [Order].Comment,
           [Order].[OrderStatus], [PaymentMethod].PaymentMethod,
          Account.AccountName AS SellerAccount, UserProfile.FullName AS Seller 
    FROM [Order]
    INNER JOIN Account ON [Order].SellerId = Account.Id
    INNER JOIN UserProfile ON Account.Id = UserProfile.AccountId
	INNER JOIN Store ON Store.Id = [Order].StoreId
    INNER JOIN PaymentMethod ON [Order].PaymentId = PaymentMethod.Id
    WHERE [Order].StoreId = @StoreId AND [Order].Id = @OrderId
`);

//get order detail list
defineProperty('getOrderDetail', `
    SELECT OrderDetail.Id, Product.[Name] AS ProductName, Product.Code AS ProductCode, OrderDetail.Amount, 
          OrderDetail.Price, (OrderDetail.Price * OrderDetail.Amount) AS Total
    FROM [OrderDetail] 
    INNER JOIN [Order] ON [Order].Id = OrderDetail.OrderId
	INNER JOIN Product ON Product.Id = OrderDetail.ProductId
    WHERE [Order].StoreId = @StoreId AND OrderDetail.OrderId = @OrderId`);