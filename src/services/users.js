/* global module, require */

var UserSchema = require('../models').user,
    utils = require('./utils'),
    logger = require('../logger').winston;

function findByEmail(email, callback) {
    'use strict';

    if (!email) {
        return utils.raiseError(null, 'No email were provided!', callback);
    }

    UserSchema.findOne({
        email: email
    }, function (err, doc) {
        if (err) {
            return utils.raiseError(err, 'An error occured while looking for an user with email ' + email, callback);
        }
        return callback(null, doc);
    });
}

function User() {}

User.prototype.findByEmail = findByEmail;

User.prototype.post = function (email, password, callback) {
    'use strict';

    if (!email || !password) {
        return utils.raiseError(null, {
            code: 400,
            message: 'Some fields are missing'
        }, callback);
    }

    findByEmail(email, function (err, doc) {
        var newUser;
        if (err) {
            return callback(err);
        }
        if (doc) {
            return utils.raiseError('The user ' + email + ' tried to registered but already was', {
                code: 409,
                message: 'User already registered'
            }, callback);
        }
        newUser = new UserSchema({
            email: email,
            password: password
        });
        newUser.save(function (error, savedUser) {
            if (error) {
                return utils.raiseError(error, {
                    code: 500,
                    message: 'An error occured while saving the user ' + email
                }, callback);
            }
            return callback(null, savedUser);
        });
    });
};

module.exports = User;
