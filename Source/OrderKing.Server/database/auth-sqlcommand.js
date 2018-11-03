var extension = require('../common/extension');

//get user's hash key
extension.defineProperty('getHashKey',
    'SELECT AccountName, Id, HashKey FROM Account WHERE AccountName = @AccountName AND Password = @Password ');

//get login session
extension.defineProperty('queryLoginSession',
    `SELECT Account.AccountName, LoginSession.Id AS SessionId FROM LoginSession 
     INNER JOIN Account ON LoginSession.AccountId = Account.Id
     WHERE AccessToken = @AccessToken`);

//insert new login session
extension.defineProperty('insertLoginSession', `INSERT INTO [dbo].[LoginSession]
                                ([AccountId], [Ip], [UsetAgent], [Referrer], [LoginTime],
                                 [LastAccessTime], [AccessToken], [AccessTokenExpired])

                                 VALUES(@AccountId, @Ip, @UsetAgent, @Referrer, @LoginTime,
                                        @LastAccessTime, @AccessToken, @AccessTokenExpired) `);

//update last access time
extension.defineProperty('updateLastAccessTimeLoginSession', 'UPDATE LoginSession SET LastAccessTime = @LastAccessTime WHERE AccountId = @AccountId');

//update expired date
extension.defineProperty('updateExpiredDateLoginSession', 'UPDATE LoginSession SET AccessTokenExpired = GETDATE() WHERE AccessToken = @AccessToken');
