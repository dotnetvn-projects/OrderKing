
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

    DECLARE @Revenue BIGINT = (SELECT SUM(TotalPrice) FROM [ORDER] WHERE StoreId = @StoreId AND [ORDER].OrderStatus = 1);
    
    SELECT @OrderCount AS TotalOrder, @NewOrderCount AS TotalNewOrder, @ProductCount AS TotalProduct,
           @Revenue AS TotalRevenue
`);

// get product list that the store sold in day
defineProperty('ProductSoldInDay', `

DECLARE @TotalRecord INT = (SELECT COUNT(Temp.Id)
     FROM (
           SELECT [PRODUCT].Id
	       FROM [ORDER] 
	       INNER JOIN [ORDERDETAIL] ON [ORDERDETAIL].OrderId = [ORDER].Id
	       INNER JOIN PRODUCT ON [ORDERDETAIL].ProductId = [PRODUCT].ID
	       WHERE [ORDER].StoreId = @StoreId 
			       AND MONTH([ORDER].CreatedDate) = MONTH(GETDATE())
			       AND YEAR([ORDER].CreatedDate) = YEAR(GETDATE()) 
			       AND DAY([ORDER].CreatedDate) = DAY(GETDATE())
	       GROUP BY [PRODUCT].Id) AS Temp
          );

     SELECT @TotalRecord AS TotalRecord, [PRODUCT].Id, [PRODUCT].Code, [PRODUCT].Name, COUNT([PRODUCT].ID) AS AmountSold,
            SUM([ORDERDETAIL].Amount * [ORDERDETAIL].Price) AS Revenue
     FROM [ORDER] 
     INNER JOIN [ORDERDETAIL] ON [ORDERDETAIL].OrderId = [ORDER].Id
     INNER JOIN PRODUCT ON [ORDERDETAIL].ProductId = [PRODUCT].ID
     WHERE [ORDER].StoreId = @StoreId AND [ORDER].OrderStatus = 1
           AND MONTH([ORDER].CreatedDate) = MONTH(GETDATE())
           AND YEAR([ORDER].CreatedDate) = YEAR(GETDATE()) 
           AND DAY([ORDER].CreatedDate) = DAY(GETDATE())
     GROUP BY [PRODUCT].Id, [PRODUCT].Name, [PRODUCT].Code
	 ORDER BY [PRODUCT].Id, [PRODUCT].Name, [PRODUCT].Code
	 OFFSET @PageSize * (@PageNumber - 1) ROWS
     FETCH NEXT @PageSize ROWS ONLY;
`);

//calculate revenue in monthly
defineProperty('MonthlyRevenueInYear', `
SELECT YEAR([Order].CreatedDate) AS [Year], SUM([Order].TotalPrice) AS YearRevenue,
       SUM(CASE MONTH([Order].CreatedDate) WHEN 1 THEN [Order].TotalPrice ELSE 0 END) AS January,
       SUM(CASE MONTH([Order].CreatedDate) WHEN 2 THEN [Order].TotalPrice ELSE 0 END) AS February,
	   SUM(CASE MONTH([Order].CreatedDate) WHEN 3 THEN [Order].TotalPrice ELSE 0 END) AS March,
	   SUM(CASE MONTH([Order].CreatedDate) WHEN 4 THEN [Order].TotalPrice ELSE 0 END) AS April,
	   SUM(CASE MONTH([Order].CreatedDate) WHEN 5 THEN [Order].TotalPrice ELSE 0 END) AS May,
	   SUM(CASE MONTH([Order].CreatedDate) WHEN 6 THEN [Order].TotalPrice ELSE 0 END) AS June,
	   SUM(CASE MONTH([Order].CreatedDate) WHEN 7 THEN [Order].TotalPrice ELSE 0 END) AS July,
	   SUM(CASE MONTH([Order].CreatedDate) WHEN 8 THEN [Order].TotalPrice ELSE 0 END) AS August,
	   SUM(CASE MONTH([Order].CreatedDate) WHEN 9 THEN [Order].TotalPrice ELSE 0 END) AS September,
	   SUM(CASE MONTH([Order].CreatedDate) WHEN 10 THEN [Order].TotalPrice ELSE 0 END) AS October,
	   SUM(CASE MONTH([Order].CreatedDate) WHEN 11 THEN [Order].TotalPrice ELSE 0 END) AS November,
	   SUM(CASE MONTH([Order].CreatedDate) WHEN 12 THEN [Order].TotalPrice ELSE 0 END) AS December
FROM [Order] inner join OrderDetail ON OrderDetail.OrderId = [Order].Id
WHERE YEAR([Order].CreatedDate) = @YearInput AND StoreId = @StoreId AND [ORDER].OrderStatus = 1
GROUP BY YEAR([Order].CreatedDate)
`);

// revenue in day
defineProperty('getRevenueReport', `
DECLARE @Daily BIGINT =
  (SELECT (CASE
               WHEN SUM(TotalPrice) IS NULL THEN 0
               ELSE SUM(TotalPrice)
           END) AS Revenue
   FROM [ORDER]
   WHERE StoreId = @StoreId
     AND [ORDER].OrderStatus = 1
     AND CAST(CreatedDate AS DATE) = CAST(GETDATE() AS DATE))

DECLARE @Weekly BIGINT =
  (SELECT CASE
              WHEN SUM(TotalPrice) IS NULL THEN 0
              ELSE SUM(TotalPrice)
          END AS Revenue
   FROM [ORDER]
   WHERE StoreId = @StoreId
     AND [ORDER].OrderStatus = 1
     AND CAST([Order].CreatedDate AS DATE) BETWEEN DATEADD(DAY, -7, GETDATE()) AND DATEADD(DAY, 1, GETDATE()))

DECLARE @Monthly BIGINT =
  (SELECT CASE
              WHEN SUM(TotalPrice) IS NULL THEN 0
              ELSE SUM(TotalPrice)
          END AS Revenue
   FROM [ORDER]
   WHERE StoreId = @StoreId
     AND [ORDER].OrderStatus = 1
     AND MONTH(CreatedDate) = MONTH(GETDATE()))

DECLARE @Yearly BIGINT =
  (SELECT CASE
              WHEN SUM(TotalPrice) IS NULL THEN 0
              ELSE SUM(TotalPrice)
          END AS Revenue
   FROM [ORDER]
   WHERE StoreId = @StoreId
     AND [ORDER].OrderStatus = 1
     AND YEAR([Order].CreatedDate) = YEAR(GETDATE()))

SELECT @Daily AS DailyRevenue,
       @Weekly AS WeeklyRevenue,
       @Monthly AS MonthlyRevenue,
       @Yearly AS YearlyRevenue
`);

// get sale report along with date range
defineProperty('getSaleReportWithDateRagne', `
    SELECT CAST([ORDER].CreatedDate AS DATE) AS CreatedDate, COUNT([ORDER].Id) AS TotalOrder, 
           SUM(OrderDetail.Amount) AS Totalsold, SUM([ORDER].TotalPrice) AS TotalRevenue 
    FROM [ORDER] INNER JOIN OrderDetail ON OrderDetail.OrderId = [ORDER].Id
    WHERE [ORDER].StoreId = @StoreId AND [ORDER].OrderStatus = 1 AND {0}
    GROUP BY CAST([ORDER].CreatedDate AS DATE)
    ORDER BY CAST([ORDER].CreatedDate AS DATE) DESC
    OFFSET @PageSize * (@PageNumber - 1) ROWS
    FETCH NEXT @PageSize ROWS ONLY;
`);

// get product report along with date
defineProperty('ProductReportWithDate', `
    SELECT Product.Id, Product.Name, SUM(OrderDetail.Amount) TotalSold,
       SUM(OrderDetail.Amount * OrderDetail.Price) AS TotalRevenue 
    FROM [ORDER] o INNER JOIN ORDERDetail ON OrderDetail.Orderid = o.id
    INNER JOIN Product ON OrderDetail.ProductId = Product.id
    WHERE o.StoreId = @StoreId AND o.OrderStatus = 1
          AND o.CreatedDate BETWEEN CAST(@StartDate AS DATE) AND CAST(@EndDate AS DATE)
    GROUP BY  Product.Id, Product.Name
    ORDER BY SUM(OrderDetail.Amount) DESC
`);
