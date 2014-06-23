/**
 * @class ares.server.controller.Users
 *
 * @author Marco Jahn <marco.jahn@prodyna.com>
 */
var express = require('express'),
    mongoose = require('mongoose'),
    authorization = require('../middleware/authorization'),
    User = mongoose.model('User');

var users = {};
// http://bites.goodeggs.com/posts/export-this/
exports = module.exports = users;
users.routes = express.Router();

users.listUsers = function (req, res, next) {
    User.find({}, function (err, user) {
        if (err) return next(err);

        //res.json('200', user);
        res.json({ // TODO util!
            success: true,
            total: user.length,
            records: user
        });
    });
};

users.getUser = function (req, res, next) {
    //res.send(200, 'get user by id: ' + req.params.id);
    var id = req.params.id;

    User.findById(id, function (err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('Failed to load user: ' + user));

        res.json(200, user);
    });
};

users.createUser = function (req, res, next) {
    var user = new User(req.body);

    user.save(function (err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('Failed to save user: ' + user));

        res.json(200, user);
    });
};

users.updateUser = function (req, res, next) {
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
        if (err) return next(err);
        if (!user) return next(new Error('Failed to update user: ' + user));

        user.set(req.body);
        user.save(function (err) {
            if (err) return next(err);

            res.json(200, user);
        });
    });
};

users.deleteUser = function (req, res, next) {
    var userId = req.params.id;

    User.findByIdAndRemove(userId, function (err) {
        if (err) return next(err);

        res.json(200, {success: true});
    });
};

/**
 * @route GET /
 * Sends a list of users
 *
 * @authorization {role} [name=guest] guest Authorization additional text
 */
users.routes.get('/', authorization('guest'), users.listUsers);

/**
 * @route GET /:id
 * Sends a user given by id.
 *
 * @param {Number} id User id.
 *
 * @authorization {role} [name=guest] guest Authorization additional text
 *
 * @return {User} User.
 */
users.routes.get('/:id', authorization('guest'), users.getUser);

/**
 * @route POST /
 * Create a new user.
 *
 * @authorization {role} [name=admin] admin Authorization additional text
 *
 * @return {User} Created user.
 */
users.routes.post('/', authorization('admin'), users.createUser);

/**
 * @route PUT /:id
 * Update a user
 *
 * @authorization {role} [name=admin] admin Authorization additional text
 *
 * @return {User} Updated user.
 */
users.routes.put('/:id', authorization('admin'), users.updateUser);

/**
 * @route DELETE /:id
 * Delete a user.
 *
 * @authorization {role} [name=admin] admin Authorization additional text
 *
 * @return {Boolean} success:true
 */
users.routes.delete('/:id', authorization('admin'), users.deleteUser);