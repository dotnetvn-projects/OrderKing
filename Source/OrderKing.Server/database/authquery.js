function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
}

define("getHashKey", 'SELECT HashKey FROM Account WHERE AccountName = @AccountName AND Password = @Password ');

define("queryLoginSession", 'SELECT Id FROM LoginSession WHERE AccessToken = @AccessToken');

