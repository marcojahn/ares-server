/**
 * @class ares.server.middleware.Authorization
 *
 * @author Marco Jahn <marco.jahn@prodyna.com>
 */

/**
 * Method auth... bla
 * @param {Object} req request object.
 * @param res
 * @param next
 */
module.exports = Authorization;

function defaultFailureHandler(req, res, next) {
    res.json(403, {success: false, reason: 'not_authorized'});
}

function Authorization (options) {
    return function (req, res, next) {
        if (req.session.user.usergroup === 'admin') {
            next();
        } else if (req.session.user.usergroup === options) {
            next();
        } else if (options === 'guest' && req.session.user.usergroup === 'user') {
            next();
        } else {
            console.log('authorization middleware :: not authorized');
            defaultFailureHandler(req, res, next);
        }
    };
}