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
                       profile.IdentityCard
                       FROM Account ac
                       INNER JOIN UserProfile profile ON ac.Id = profile.AccountId
                       INNER JOIN LoginSession ss ON ac.Id = ss.AccountId
                       WHERE ss.AccessToken = @AccessToken AND ac.IsActived = 1`);

//get account by account id
defineProperty('getAccountByAccountId',
    `SELECT ac.* FROM Account ac WHERE ac.Id = @AccountId AND ac.IsActived = 1`);

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
    INSERT INTO UserProfile(AccountId, FullName, Email, PhoneNumber, Address, Address2, IdentityCard)
    VALUES (@AccountId, @FullName, @Email, @PhoneNumber, @Address, @Address2, @IdentityCard)
`);

//delete account
defineProperty('deleteAccount', `
    DELETE FROM Account WHERE Id = @AccountId
`);