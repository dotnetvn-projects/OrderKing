var defineProperty = function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
};

//get store info by access token
defineProperty('getStoreInfoByAccessToken',
    `SELECT Store.StoreName, Store.StoreAddress, Store.StorePhone, Store.Slogan
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
    INSERT INTO StoreMember (StoreId, MemberId) VALUES (@StoreId, @MemberId)`);