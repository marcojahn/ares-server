/**
 * @class ares.server.controller.Session
 *
 * Bla bla bla
 *
 * @author Marco Jahn <marco.jahn@prodyna.com>
 */

var express = require('express'),
    User = require('../model/users');

var session = {};
// http://bites.goodeggs.com/posts/export-this/
exports = module.exports = session;
session.routes = express.Router();

/**
 * Default route implementation.
 * @param req
 * @param res
 * @param next
 */
session.getDefault = function (req, res, next) {
    // TODO
    res.send('400', 'METHOD NOT ALLOWED');
};

session.getCsrfTocken = function (req, res, next) {
    res.json(200, {csrftoken: req.csrfToken()});
};

session.createSession = function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    console.log('authentication in progress: user {' + username + '}; password {' + password + '}');

    User.getAuthenticated(username, password, function (err, user, reason) {
        if (err) throw err;

        // login was successful if we have a user
        if (user) {
            // handle login success
            console.log('login success');

            // set user id to session
            req.session.user = user;
            res.json(200, user);
        }

        // otherwise we can determine why we failed
        var reasons = User.failedLogin;
        switch (reason) {
            case reasons.NOT_FOUND:
            case reasons.PASSWORD_INCORRECT:
                res.json(401, {success: false, reason: 'invalid_credentials'}); // TODO
                break;
            case reasons.MAX_ATTEMPTS:
                // send email or otherwise notify user that account is
                // temporarily locked
                res.json(401, {success: false, reason: 'user_locked'}); // TODO
                break;
        }
    });

    //res.json(200, {success: true});
};

session.deleteSession = function (req, res, next) {
    if (req.session) {
        if (!req.session.user) {
            res.json(500, {success: false, reason: 'cannot_remove_public_session'});
        }

        delete req.session.user;
        req.session.destroy(function () {
            res.clearCookie('ares-sid', { path: '/' });
            res.json(200, {success: true});
        });
    } else {
        res.json(500, {success: false, reason: 'no_session_assigned'});
    }
};

/**
 * @route GET /
 * @anonymous
 * Standard route returns x.
 */
session.routes.get('/', session.getDefault);

/**
 * @route GET /csrftoken
 * @anonymous
 * Sends session csrf token.
 */
session.routes.get('/csrftoken', session.getCsrfTocken);

/**
 * @route POST /
 * @anonymous
 * create a new session and authenticate
 */
session.routes.post('/', session.createSession);

/**
 * @route DELETE /
 * @anonymous
 * Delete a session.
 */
session.routes.delete('/', session.deleteSession);