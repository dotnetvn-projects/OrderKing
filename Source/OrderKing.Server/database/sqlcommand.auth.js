
var defineProperty = function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
};


//get user's hash key
defineProperty('getHashKey',
    'SELECT IsActived, HashKey FROM Account WHERE AccountName = @AccountName');

//login for user
defineProperty('login',
    'SELECT AccountName, Id FROM Account WHERE AccountName = @AccountName AND Password = @Password');

//login for manager
defineProperty('loginManager',
    `SELECT Account.AccountName, Account.Id FROM Account
     INNER JOIN Store ON Store.OwnerId = Account.Id
     WHERE AccountName = @AccountName AND Password = @Password`);

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

//get the expiration of token
defineProperty('getTokenExpiration', 'SELECT AccessToken, AccessTokenExpired FROM LoginSession WHERE AccessToken = @AccessToken');

//get all tokens are not expired
defineProperty('getAllTokenNotExpired', 'SELECT AccessTokenExpired, AccessToken FROM LoginSession WHERE IsExpired = 0');
