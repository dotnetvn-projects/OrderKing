var defineProperty = function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
};

//get order list by store
defineProperty('getOrderListByStore', `
    SELECT [Order].Id, Store.StoreName, [Order].OrderCode, [Order].SeqNum,
           [Order].TotalPrice, [Order].TotalAmount,[Order].CreatedDate, [Order].PrintedDate,
           CASE [Order].[OrderStatus] 
           WHEN 1 THEN 'Ho?n Th?nh' 
                  ELSE 'H?y' END AS OrderStatus,
          Account.AccountName AS SellerAccount, UserProfile.FullName AS Seller 
    FROM [Order]
    INNER JOIN Account ON [Order].SellerId = Account.Id
    INNER JOIN UserProfile ON Account.Id = UserProfile.AccountId
	INNER JOIN Store ON Store.Id = [Order].StoreId
    WHERE StoreId = @StoreId {0}
    ORDER BY CreatedDate DESC`);