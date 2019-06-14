var defineProperty = function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
};

defineProperty('getNewestList',
    `SELECT * FROM SysNotify WHERE Status = 1 ORDER BY CreatedDate DESC`
);

defineProperty('getList',
    `SELECT * FROM SysNotify WHERE ORDER BY CreatedDate DESC`
);
