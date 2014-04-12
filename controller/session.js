var express = require('express');

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

    // set user id to session
    req.session.user = {id: 4711};

    res.json(200, {success: true});
});