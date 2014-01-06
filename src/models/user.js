/* global module, require */

(function() {
    "use strict";

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ContactSchema = require('./contact'),
        UserSchema;

    UserSchema = new Schema({
        email    : String,
        password : String,
        contacts : [ ContactSchema ]
    });

    module.exports = mongoose.model('User', UserSchema);

}());