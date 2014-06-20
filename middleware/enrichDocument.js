exports.timestamps = function (obj) {
    var now = new Date();
    obj.lastmodified = now;
    if ( !obj.created ) {
        obj.created = now;
    }
};


var bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;
exports.users = function (user, next) {
    // only hash the password if it has been modified (or is new);
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
};