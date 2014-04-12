/*
var auth = function (req, res, next) {
    console.log('auth middleware');
    next();
};*/
exports.auth = function (req, res, next) {
    if (req.originalUrl.indexOf('/anonymous') === 0) {
        console.log('auth middleware :: unsecured service');
    } else {
        console.log('auth middleware :: secured service');
    }
    next();
};