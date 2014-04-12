var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    surname: String,
    lastname: String,
    username: String,
    password: String,
    email: String
});

UserSchema.path('email').index({unique: true, dropDups: true});
UserSchema.path('username').index(true);

mongoose.model('User', UserSchema);