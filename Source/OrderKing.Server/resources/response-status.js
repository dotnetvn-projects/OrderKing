//auth status object

//code: success => 100 to 110, failed => -100 to -110
exports.authen = {
    suscess: 'Successful authentication',
    suscesscode: 100,

    Failed: 'Authentication failed',
    FailedCode: -100,

    removesuccess: 'Remove authentication successful',
    removesuccesscode: 101,

    removefailed: 'Remove authentication failed',
    removefailedcode: -101
};

//code 401
exports.unauthorizedRequest = {
    message: 'Unauthorized Request!',
    code: 401
};

//code 422
exports.invalidRequest = {
    message: 'Invalid Request!',
    code: 422
};

//code
exports.badRequest = {
    message: 'Bad Request!',
    code: 400
};