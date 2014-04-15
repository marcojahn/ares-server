var express = require('express')
User = require('../model/users');

var session = express.Router();
// http://bites.goodeggs.com/posts/export-this/
exports = module.exports = session;

session.get('/', function (req, res, next) {
    // TODO
    res.send('400', 'METHOD NOT ALLOWED');
});

session.get('/csrftoken', function (req, res, next) {
    res.json(200, {csrftoken: req.csrfToken()});
});

session.post('/', function (req, res, next) {
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
                res.json(666, {success: false, reason: 'invalid_credentials'}); // TODO
                break;
            case reasons.MAX_ATTEMPTS:
                // send email or otherwise notify user that account is
                // temporarily locked
                res.json(666, {success: false, reason: 'user_locked'}); // TODO
                break;
        }
    });

    //res.json(200, {success: true});
});