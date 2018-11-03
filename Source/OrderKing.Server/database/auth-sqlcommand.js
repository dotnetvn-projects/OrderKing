var extension = require('../common/extension');

extension.defineProperty("getHashKey",
                'SELECT HashKey FROM Account WHERE AccountName = @AccountName AND Password = @Password ');

extension.defineProperty("queryLoginSession",
            'SELECT Id FROM LoginSession WHERE AccessToken = @AccessToken');

