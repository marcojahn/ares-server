/**
 * @class ares.server.middleware.Authentication
 *
 * @author Marco Jahn <marco.jahn@prodyna.com>
 */

/**
 * Method auth... bla
 * @param {Object} req request object.
 * @param res
 * @param next
 */

// TODO set logger ref to req object to be used here
exports.auth = function (req, res, next) {
    if (req.originalUrl.indexOf('/anonymous') === 0) {
        console.log('auth middleware :: unsecured service');
        next();
    } else {
        console.log('auth middleware :: secured service');
        if (req.session && req.session.user) {
            console.log('user is authenticated');
            next();
        } else {
            res.json(666, {success: false, reason: 'not_authenticated'}); // TODO
        }
    }
};