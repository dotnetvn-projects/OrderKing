var defineProperty = function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
};

//get user info by access token
defineProperty('getUserInfoByAccessToken',
               `SELECT ac.Id AS AccountId, ac.AccountName, profile.FullName, profile.Email,
                       profile.PhoneNumber, profile.Address, profile.Address2,
                       profile.IdentityCard
                       FROM Account ac
                       INNER JOIN UserProfile profile ON ac.Id = profile.AccountId
                       INNER JOIN LoginSession ss ON ac.Id = ss.AccountId
                       WHERE ss.AccessToken = @AccessToken AND ac.IsActived = 1`);

//update user info
defineProperty('updateUserInfo',
    `UPDATE [UserProfile]
     SET FullName = @FullName, Email = @Email,
         PhoneNumber = @PhoneNumber, Address = @Address,
         Address2 = @Address2, IdentityCard = @IdentityCard
     WHERE AccountId = @AccountId`);

//update password
defineProperty('updatePassword',
    `UPDATE [Account]
     SET Password = @Password
     WHERE AccountId = @AccountId`);


//update avatar
defineProperty('updateAvatar',
    `UPDATE [UserProfile]
     SET Avatar = @Avatar
     WHERE AccountId = @AccountId`);