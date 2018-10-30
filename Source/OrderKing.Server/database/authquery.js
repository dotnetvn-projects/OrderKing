function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
}
//multiline `...`
define("getHashKey", 'SELECT Id, HashKey FROM Account WHERE AccountName = @AccountName AND Password = @Password ');

define("queryLoginSession", 'SELECT Id FROM LoginSession WHERE AccessToken = @AccessToken');

define("insertLoginSession", `INSERT INTO [dbo].[LoginSession]
                                ([AccountId], [Ip], [UsetAgent], [Referrer], [LoginTime],
                                 [LastAccessTime], [AccessToken], [AccessTokenExpired])

                                 VALUES(@AccountId, @Ip, @UsetAgent, @Referrer, @LoginTime,
                                        @LastAccessTime, @AccessToken, @AccessTokenExpired) `);

define("updateLastAccessTimeLoginSession", 'UPDATE LoginSession SET LastAccessTime = @LastAccessTime WHERE AccountId = @AccountId');



