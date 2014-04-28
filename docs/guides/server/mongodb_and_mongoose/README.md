#MongoDB and Mongoose

## Mongoose

### Defining a Mongoose Schema and Model

    // Schema + Model
    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var UserSchema = new Schema({
        username: {type: String, required: true, index: {unique: true}},
        password: {type: String, required: true},
        usergroup: {type: String, required: true, default: 'user'},
        email: {type: String, required: true},
        firstname: String,
        lastname: String,
        lockUntil: Date,
        loginAttempts: Number
    });

    // ... more code

    module.exports = mongoose.model('User', UserSchema);

### Using Model from controller

    // definition in config/routes.js
    var users = require('./controller/users');
    app.resource('users', users);

    // controller/users.js
    var mongoose = require('mongoose'),
        Users = mongoose.model('Users');

    /**
     * @route GET /
     *
     * @anonymous
     * Sends a list of users
     */
    users.get('/', function (req, res, next) {
        User.find({}, function (err, user) {
             /* if (err) handle your error*/

            res.json(200, {
                success: true,
                total: user.length,
                records: user
            });
        });
    });
    // ...