var defineProperty = function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
};

//get store info by access token
defineProperty('getStoreInfoByAccessToken',
    `SELECT Store.StoreName, Store.Email, Store.StoreAddress, Store.StorePhone, Store.Slogan
     FROM LoginSession
     INNER JOIN StoreMember ON LoginSession.AccountId = StoreMember.AccountId
     INNER JOIN Store ON Store.Id = StoreMember.StoreId
     WHERE LoginSession.IsExpired = 0 AND LoginSession.AccessToken = @AccessToken `);

//get store logo by access token
defineProperty('getStoreLogoByAccessToken',
    `SELECT Store.Logo
     FROM LoginSession
     INNER JOIN StoreMember ON LoginSession.AccountId = StoreMember.AccountId
     INNER JOIN Store ON Store.Id = StoreMember.StoreId
     WHERE LoginSession.IsExpired = 0 AND LoginSession.AccessToken = @AccessToken `);

//get store id by access token
defineProperty('getStoreIdByAccessToken',
    `SELECT Store.Id AS StoreId
     FROM LoginSession
     INNER JOIN StoreMember ON LoginSession.AccountId = StoreMember.AccountId
     INNER JOIN Store ON Store.Id = StoreMember.StoreId
     WHERE LoginSession.IsExpired = 0 AND LoginSession.AccessToken = @AccessToken `);

//update store info
defineProperty('updateStoreInfo', `
    UPDATE Store
    SET StoreName = @StoreName,
        StoreAddress = @StoreAddress,
        StorePhone = @StorePhone,
        Slogan = @Slogan
    WHERE Id = @StoreId`);

//add new member
defineProperty('addNewMember', `
    INSERT INTO StoreMember (StoreId, AccountId) VALUES (@StoreId, @MemberId)`);

//remove member
defineProperty('removeMember', `
    DELETE FROM StoreMember WHERE StoreId = @StoreId AND AccountId = @MemberId`);

//update logo
defineProperty('updateLogo',
    `UPDATE [Store] SET Logo = @Logo WHERE Id = @StoreId`);

//get member in store
defineProperty('getMemberInStore', `
    SELECT Store.StoreName, Account.AccountName, UserProfile.FullName,
           UserProfile.Email, UserProfile.PhoneNumber, UserProfile.[Address],
	       UserProfile.[Address2], UserProfile.IdentityCard 
         FROM Store INNER JOIN StoreMember ON Store.Id = StoreMember.StoreId
         INNER JOIN Account ON StoreMember.AccountId = Account.Id
	     INNER JOIN UserProfile ON Account.Id = UserProfile.AccountId
         WHERE Store.Id = @StoreId
`);

//create new store
defineProperty('createNewStore', `
    INSERT INTO Store(StoreName, OwnerId, Email, CreatedDate, StoreAddress, StorePhone, Slogan, Logo)
    VALUES (@StoreName, @OwnerId, @Email, @CreatedDate, @StoreAddress, @StorePhone, @Slogan, @Logo)
    SELECT SCOPE_IDENTITY() AS StoreId
`);

//get store owner id
defineProperty('getStoreOwnerId', `
    SELECT Store.Id 
    FROM LoginSession INNER JOIN Store ON Store.OwnerId = LoginSession.AccountId
    WHERE AccessToken = @AccessToken
`);

//get logo
defineProperty('getStoreLogo', `SELECT Store.Logo 
    FROM LoginSession 
    INNER JOIN StoreMember ON LoginSession.AccountId = StoreMember.AccountId
    INNER JOIN Store ON Store.Id = StoreMember.StoreId
    WHERE AccessToken = @AccessToken`);