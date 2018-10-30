//auth status object

//code: for success => 100 to 110, for failed => -100 to -110
exports.authen = {
    suscess: 'Successful authentication',
    suscesscode: 100,

    Failed: 'Authentication failed',
    FailedCode: -100,

    removesuccess: 'Remove authentication successful',
    removesuccesscode: 101,

    removefailed: 'Remove authentication failed',
    removefailedcode: -101,
};

//code 401
exports.invalidRequest = {
    message: 'Unauthorized Request!',
    code: 401
};