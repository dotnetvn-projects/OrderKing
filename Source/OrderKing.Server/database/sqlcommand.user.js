var defineProperty = function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
};

//get user info by access token
defineProperty('getUserInfoByAccessToken',
               `SELECT ac.AccountName, profile.FullName, profile.Email,
                       profile.PhoneNumber, profile.Address, profile.Address2,
                       profile.IdentityCard, ac.CreatedDate
                       FROM Account ac
                       INNER JOIN UserProfile profile ON ac.Id = profile.AccountId
                       INNER JOIN LoginSession ss ON ac.Id = ss.AccountId
                       WHERE ss.AccessToken = @AccessToken AND ac.IsActived = 1`);

//get user info by id
defineProperty('getUserInfoById',
    `SELECT ac.AccountName, profile.FullName, profile.Email,
                       profile.PhoneNumber, profile.Address, profile.Address2,
                       profile.IdentityCard, ac.CreatedDate, ac.IsActived
                       FROM Account ac
                       INNER JOIN UserProfile profile ON ac.Id = profile.AccountId
                       WHERE ac.Id = @AccountId`);

//get account by account id
defineProperty('getAccountByAccountId',
    `SELECT ac.* FROM Account ac WHERE ac.Id = @AccountId`);

//get account by account name
defineProperty('getAccountByAccountName',
    `SELECT ac.* FROM Account ac WHERE ac.AccountName = @AccountName AND ac.IsActived = 1`);

//get accountid by access token
defineProperty('getAccountIdByToken',
    `SELECT AccountId FROM LoginSession ss 
                      WHERE ss.AccessToken = @AccessToken`);

//update user info
defineProperty('updateUserInfo',
    `UPDATE [UserProfile]
     SET FullName = @FullName, Email = @Email,
         PhoneNumber = @PhoneNumber, Address = @Address,
         Address2 = @Address2, IdentityCard = @IdentityCard
     WHERE AccountId = @AccountId`);

//update password
defineProperty('updatePassword',
    `UPDATE [Account] SET Password = @Password WHERE AccountId = @AccountId`);

//update avatar
defineProperty('updateAvatar',
    `UPDATE [UserProfile] SET Avatar = @Avatar WHERE AccountId = @AccountId`);

//create account
defineProperty('createAccount', `
    INSERT INTO Account(AccountName, Password, CreatedDate, HashKey, IsActived)
    VALUES (@AccountName, @Password, @CreatedDate, @HashKey, @IsActived)
    SELECT SCOPE_IDENTITY() AS AccountId
`);

//create user profile
defineProperty('createUserProfile', `
    INSERT INTO UserProfile(AccountId, FullName, Email, PhoneNumber, Address, Address2, IdentityCard, Avatar)
    VALUES (@AccountId, @FullName, @Email, @PhoneNumber, @Address, @Address2, @IdentityCard, @Avatar)
`);

//delete account
defineProperty('deleteAccount', `
    DELETE FROM Account WHERE Id = @AccountId
`);

//lock member
defineProperty('lockMember', `
    UPDATE Account SET IsActived = 0 WHERE Id = @AccountId
`);

//unlock member
defineProperty('unLockMember', `
    UPDATE Account SET IsActived = 1 WHERE Id = @AccountId
`);

//get avatar
defineProperty('getAvatar', `
    SELECT [Avatar] FROM UserProfile WHERE AccountId = @AccountId
`);

//check whether account has already exist in database
defineProperty('CheckExistAccount', `
    SELECT Id FROM Account WHERE AccountName = @AccountName AND AccountId <> @AccountId
`);

//check whether email has already exist in database
defineProperty('CheckExistEmail', `
    SELECT Id FROM UserProfile WHERE Email = @Email AND AccountId <> @AccountId
`);

//check whether phone has already exist in database
defineProperty('CheckExistPhone', `
    SELECT Id FROM UserProfile WHERE PhoneNumber = @PhoneNumber AND AccountId <> @AccountId
`);

//check whether user info has already exist in database
defineProperty('CheckExistIdentityCard', `
    SELECT Id FROM UserProfile WHERE IdentityCard = @IdentityCard AND AccountId <> @AccountId
`);
