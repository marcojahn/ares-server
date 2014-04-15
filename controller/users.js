var express = require('express');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var users = express.Router();
// http://bites.goodeggs.com/posts/export-this/
exports = module.exports = users;

//users.param('id', require('../middleware/authorization').isOwner);
// simple logger for this router's requests
// all requests to this router will first hit this middleware
/*users.use(function(req, res, next) {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
});*/

//https://github.com/ForbesLindesay/connect-roles/blob/master/index.js
//http://passportjs.org/guide/
var authorize = function (checks) {
    return function (req, res, next) {
        console.log('running authorization based on checks: ' + checks);
        if (checks.indexOf('forceFail') !== -1) {
            console.log('Force failed');
            res.redirect('/anonymous/login;')
        }
        next();
    };
};

users.get('/', function (req, res, next) {
    User.find({}, function (err, user) {
        if (err) console.log(err);

        res.json({ // TODO util!
            success: true,
            total: user.length,
            records: user
        });
    });
});

users.get('/:id', authorize('role:admin owner:id permission:read'), function (req, res, next) {
    //res.send(200, 'get user by id: ' + req.params.id);
    var id = req.params.id;

    User.findById(id, function (err, user) {
        // TODO
        if (err) console.log(err);
        if (!user) console.log(new Error('Failed to load user: ' + user));

        res.json(200, user);
    });
});

/* Demo data
{
    "username": "marco.jahn",
    "password": "1234",
    "email": "marco.jahn@gmail.com",
    "firstname": "Marco",
    "lastname": "Jahn"
}
 */
users.post('/', function (req, res, next) {
    var user = new User(req.body);

    user.save(function (err, user) {
        // TODO
        if (err) console.log(err);
        if (!user) console.log(new Error('Failed to save user: ' + user));

        res.json(200, user);
    });
});

users.put('/:id', function (req, res, next) {
    var userId = req.params.id;

    /*
    <Model>.update -> will not (!) send the modified model back!
    User.update({_id: userId}, req.body, function (err, numberAffected, raw) {
        if (err) console.log(err);

        res.json(200, raw);
    });*/

    /*
    findByIdAndUpdate does not (!) trigger "pre::save" action...
    User.findByIdAndUpdate(userId, req.body, function (err, user) {
        if (err) console.log(err);
        if (!user) console.log(new Error('Failed to update user: ' + user));

        res.json(200, user);
    });*/

    User.findById(userId, function (err, user) {
        if (err) console.log(err);
        if (!user) console.log(new Error('Failed to update user: ' + user));

        user.set(req.body);
        user.save(function (err) {
            if (err) console.log(err);
            if (!user) console.log(new Error('Failed to update user: ' + user));

            res.json(200, user);
        });
    });
});

users.delete('/:id', authorize('role:admin owner:id forceFail'), function (req, res, next) {
    res.send(200, 'User deleted');
});