var defineProperty = function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
};

defineProperty('getNewestList',
    `SELECT SysNotify.* 
     FROM SysNotify 
     INNER JOIN SysNotifyAccount ON SysNotify.Id = SysNotifyAccount.SysNotifyId
     INNER JOIN Account ON SysNotifyAccount.AccountId = Account.Id
     WHERE HasRead = 0 AND SysNotifyAccount.AccountId = @AccountId
     ORDER BY UpdatedDate DESC`
);

defineProperty('getList', `
    DECLARE @TotalRecord INT = (
       SELECT COUNT(Temp.Id)
       FROM (SELECT SysNotify.Id 
             FROM SysNotify 
             INNER JOIN SysNotifyAccount ON SysNotify.Id = SysNotifyAccount.SysNotifyId
             INNER JOIN Account ON SysNotifyAccount.AccountId = Account.Id
             WHERE SysNotifyAccount.AccountId = @AccountId) AS Temp
      );

    SELECT SysNotify.*, @TotalRecord AS TotalRecord 
    FROM SysNotify 
    INNER JOIN SysNotifyAccount ON SysNotify.Id = SysNotifyAccount.SysNotifyId
    INNER JOIN Account ON SysNotifyAccount.AccountId = Account.Id
    WHERE SysNotifyAccount.AccountId = @AccountId
    ORDER BY UpdatedDate DESC
    OFFSET @PageSize * (@PageNumber - 1) ROWS
    FETCH NEXT @PageSize ROWS ONLY;
`);

defineProperty('getDetail',
    `SELECT * FROM SysNotify WHERE Id = @Id`
);

defineProperty('updateHasRead',
    `UPDATE SysNotifyAccount SET HasRead = @HasRead
     WHERE AccountId = @AccountId AND SysNotifyId = @SysNotifyId`
);

defineProperty('updateHasReadForAccount',
    `UPDATE SysNotifyAccount SET HasRead = @HasRead
     WHERE AccountId = @AccountId`
);