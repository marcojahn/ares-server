var bcrypt = require('bcrypt'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema,
    mongoosePluginDocumentTimestamps = require('../util/mongoose/plugins/documenttimestamps'),
    documentEnrichUsers = require('../middleware/enrichDocument').users,

    // these values can be whatever you want - we're defaulting to a
    // max of 5 attempts, resulting in a 2 hour lock
    MAX_LOGIN_ATTEMPTS = 5,
    LOCK_TIME = 2 * 60 * 60 * 1000;

// TODO validUntil must not be in the past
var LicenseSchema = new Schema({
    planetype: {type: String, required: true, index: true},
    validUntil: {type: Date, required: true}
});

var UserSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    usergroup: {type: String, required: true, default: 'user'},
    email: {type: String, required: true},
    firstname: String,
    lastname: String,
    lockUntil: Date,
    loginAttempts: Number,
    licenses: [LicenseSchema]
});

UserSchema.path('usergroup').validate(function (value) {
    return /admin|user|guest/i.test(value);
}, 'Invalid usergroup');

UserSchema.virtual('isLocked').get(function () {
    // check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

UserSchema.pre('save', function (next) {
    documentEnrichUsers(this, next);
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.methods.incLoginAttempts = function(cb) {
    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        }, cb);
    }
    // otherwise we're incrementing
    var updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    return this.update(updates, cb);
};

UserSchema.methods.getValidLicenses = function () {
    var i, license,
        now = moment().subtract(1, 'day'),
        userLicenses = this.licenses,
        iLen = userLicenses.length,
        result = [];

    for (i = 0; i < iLen; i++) {
        license = userLicenses[i];

        if (moment(now).isBefore(license.validUntil)) {
            result.push(license);
        }
    }

    return result;
};

UserSchema.methods.isAllowedToReservePlanetypeAndUntil = function (planetype, until) {
    var i, license,
        retVal = false,
        licenses = this.getValidLicenses(),
        iLen = licenses.length;

    for (i = 0; i < iLen; i++) {
        license = licenses[i];

        // check if planetype is valid
        if (license.planetype === planetype) {

            // check if license is valid until reservation ends
            if (moment(until).isBefore(license.validUntil)) {
                retVal = true;
            }
        }
    }

    return retVal;
};

// expose enum on the model, and provide an internal convenience reference
var reasons = UserSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};

UserSchema.statics.getAuthenticated = function(username, password, cb) {
    this.findOne({ username: username }, function(err, user) {
        if (err) return cb(err);

        // make sure the user exists
        if (!user) {
            return cb(null, null, reasons.NOT_FOUND);
        }

        // check if the account is currently locked
        if (user.isLocked) {
            // just increment login attempts if account is already locked
            return user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.MAX_ATTEMPTS);
            });
        }

        // test for a matching password
        user.comparePassword(password, function(err, isMatch) {
            if (err) return cb(err);

            // check if the password was a match
            if (isMatch) {
                // if there's no lock or failed attempts, just return the user
                if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
                // reset attempts and lock info
                var updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };
                return user.update(updates, function(err) {
                    if (err) return cb(err);
                    return cb(null, user);
                });
            }

            // password is incorrect, so increment login attempts before responding
            user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.PASSWORD_INCORRECT);
            });
        });
    });
};

UserSchema.plugin(mongoosePluginDocumentTimestamps);
module.exports = mongoose.model('User', UserSchema);