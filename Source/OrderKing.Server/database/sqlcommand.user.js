var defineProperty = function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
};

//get user info
defineProperty('getUserInfo', `SELECT ac.AccountName, profile.FullName, profile.Email,
                                      profile.PhoneNumber, profile.Address, profile.Address2,
                                      profile.IdCard
                               FROM Account ac
                               INNER JOIN UserProfile profile ON ac.Id = profile.AccountId
                               WHERE ac.Id = @AccountId AND IsActived = 1`);