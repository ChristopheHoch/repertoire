/* global module, require */

(function() {
    "use strict";

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var ContactSchema = new Schema({
        first_name : String,
        last_name  : String,
        email      : String
    });

    var UserSchema = new Schema({
        email    : String,
        password : String,
        contacts : [ ContactSchema ]
    });

    mongoose.model('Contact', ContactSchema);
    mongoose.model('User', UserSchema);
    module.exports = mongoose;

}());