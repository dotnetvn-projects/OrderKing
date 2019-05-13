var defineProperty = function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
};

//insert audit
defineProperty('insertAudit', `
       INSERT INTO [dbo].[Audit] (StoreId, AccountId, AuditContent, CreatedDate)
       VALUES(@StoreId, @AccountId, @AuditContent, GETDATE())
`);

//delete audit
defineProperty('deleteAudit', `
       DELETE FROM [dbo].[Audit] WHERE Id IN(@Id)
`);

//get audit list
defineProperty('getAuditList', `
       DECLARE @TotalRecord INT = (SELECT COUNT(Temp.Id)
                FROM (
                    SELECT AUDIT.Id
                    FROM AUDIT INNER JOIN STORE ON STORE.Id = AUDIT.StoreId
                    INNER JOIN ACCOUNT ON AUDIT.AccountId = ACCOUNT.Id
                    INNER JOIN USERPROFILE ON USERPROFILE.AccountId = ACCOUNT.Id)
                    WHERE AUDIT.StoreId = @StoreId
                AS Temp
              );

       SELECT AUDIT.Id, USERPROFILE.FullName AS StaffName, AUDIT.AuditContent, AUDIT.CreatedDate, @TotalRecord AS TotalRecord
       FROM AUDIT INNER JOIN STORE ON STORE.Id = AUDIT.StoreId
       INNER JOIN ACCOUNT ON AUDIT.AccountId = ACCOUNT.Id
       INNER JOIN USERPROFILE ON USERPROFILE.AccountId = ACCOUNT.Id
       WHERE AUDIT.StoreId = @StoreId {0}
       ORDER BY AUDIT.CreatedDate DESC
       OFFSET @PageSize * (@PageNumber - 1) ROWS
       FETCH NEXT @PageSize ROWS ONLY;
`);