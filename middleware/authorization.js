// 'use strict';

module.exports = Roles;

function Roles (options) {
    options = options || {};
    this.functionList = [];
    this.failureHandler = options.failureHandler || defaultFailureHandler;
    this.async = options.async || false;
    this.userProperty = options.userProperty || 'user';
}

function defaultFailureHandler(req, res, action) {
    res.json(403, {success: false, reason: 'not_authorized'}); // TODO
}


/*exports.isOwner = function (req, res, next, id) {
    // TODO
    console.log('authorization middleware');
    if (!req.session || !req.session.user) {
        req.session = {user: {id: 'foobar'}};
    }
    console.log(req.session.user.id);

    if (id === req.session.user.id) {
        next();
    }

    //next(new Error('Method not allowed'));
    res.json(666, 'You are not allowed to edit that entry');
};*/