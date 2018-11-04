//auth status defination

//code: success => 200, failed => 500 (internal error)
exports.common = {
    suscess: 'Success',
    suscesscode: 200,

    failed: 'Failed',
    failedcode: 500
};

//code 410
exports.tokenExpired = {
    message: 'AccessToken is expired!',
    code: 410
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