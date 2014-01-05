/* global module, require */

(function() {
    "use strict";

    var UserSchema = require('../models').model('User');

    function User() {}

    User.prototype.get = function(email, callback) {
        UserSchema.findOne({"email" : email}, function(error, user) {
            if(error) {
                return callback({
                    code: 500,
                    message: 'Internal Server Error'
                }, null);
            }
            return callback(null, user);
        });
    };

    User.prototype.post = function(email, password, callback) {
        UserSchema.findOne({"email" : email}, function(error, user) {
            var newUser;
            if(error) {
                return callback({
                    code: 500,
                    message: 'Internal Server Error'
                }, null);
            }
            if(user) {
                return callback({
                    code: 409,
                    message: 'User already registered'
                }, null);
            }
            newUser = new UserSchema({ email: email, password: password});
            newUser.save(function(error, savedUser) {
                if(error) {
                    return callback({
                        code: 500,
                        message: 'Internal Server Error'
                    }, null);
                }
                return callback(null, savedUser);
            });
        });
    };

    module.exports = User;

}());