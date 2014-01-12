/* global module, require */

var UserSchema = require('../models').user,
    logger = require('../logger').winston;

function User() {}

User.prototype.post = function(email, password, callback) {
    "use strict";
    logger.silly('Creating a new user...');

    if(!email || !password) {
        logger.warn('Some fields are missing!');
        return callback({
            code: 400,
            message: 'Some fields are missing'
        }, null);
    }

    UserSchema.findOne({"email" : email}, function(error, user) {
        var newUser;
        if(error) {
            logger.error('An error occured while looking for an user with email ' + email);
            logger.error(error);
            return callback({
                code: 500,
                message: 'Internal Server Error'
            }, null);
        }
        if(user) {
            logger.info('The user ' + email + ' tried to registered but already was');
            return callback({
                code: 409,
                message: 'User already registered'
            }, null);
        }
        newUser = new UserSchema({ email: email, password: password});
        newUser.save(function(error, savedUser) {
            if(error) {
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