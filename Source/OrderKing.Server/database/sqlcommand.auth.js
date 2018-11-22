//var extension = require('../common/extension');

var defineProperty = function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
};


//get user's hash key
defineProperty('getHashKey',
    'SELECT HashKey FROM Account WHERE AccountName = @AccountName');

//get user's hash key
defineProperty('login',
    'SELECT AccountName, Id FROM Account WHERE AccountName = @AccountName AND Password = @Password');

//get login session
defineProperty('queryLoginSession',
    `SELECT Account.AccountName, AccessTokenExpired,
     LoginSession.Id AS SessionId, IsExpired
     FROM LoginSession 
     INNER JOIN Account ON LoginSession.AccountId = Account.Id
     WHERE AccessToken = @AccessToken`);

//insert new login session
defineProperty('insertLoginSession', `INSERT INTO [dbo].[LoginSession]
                                ([AccountId], [Ip], [UsetAgent], [Referrer], [LoginTime],
                                 [LastAccessTime], [AccessToken], [AccessTokenExpired], [IsExpired])

                                 VALUES(@AccountId, @Ip, @UsetAgent, @Referrer, @LoginTime,
                                        @LastAccessTime, @AccessToken, @AccessTokenExpired, 0) `);

//update last access time
defineProperty('updateLastAccessTimeLoginSession', 'UPDATE LoginSession SET LastAccessTime = GETDATE() WHERE AccessToken = @AccessToken');

//update expired date
defineProperty('updateExpiredDateLoginSession', 'UPDATE LoginSession SET AccessTokenExpired = GETDATE(), IsExpired = 1 WHERE AccessToken = @AccessToken');
