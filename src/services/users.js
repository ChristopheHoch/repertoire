/* global module, require */

var UserSchema = require('../models').user,
    utils = require('./utils'),
    logger = require('../logger').winston;

function findByEmail(email, callback) {
    'use strict';
    logger.silly('Find user with email: ' + email);

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
    logger.silly('Creating a new user...');

    if (!email || !password) {
        logger.warn('Some fields are missing!');
        return callback({
            code: 400,
            message: 'Some fields are missing'
        }, null);
    }

    findByEmail(email, function (err, doc) {
        var newUser;
        if (err) {
            return callback(err);
        }
        if (doc) {
            logger.info('The user ' + email + ' tried to registered but already was');
            return callback({
                code: 409,
                message: 'User already registered'
            }, null);
        }
        newUser = new UserSchema({
            email: email,
            password: password
        });
        newUser.save(function (error, savedUser) {
            if (error) {
                logger.error('An error occured while savin the user ' + email);
                logger.error(error);
                return callback({
                    code: 500,
                    message: 'Internal Server Error'
                }, null);
            }
            logger.info('A new user has been successfully registered with email ' + email);
            return callback(null, savedUser);
        });
    });
};

module.exports = User;
