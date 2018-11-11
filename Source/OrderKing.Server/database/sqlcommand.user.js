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