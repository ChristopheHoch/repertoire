/* global exports, require */

var UserService = require('../services').users,
    User = new UserService(),
    logger = require('../logger').winston;

function registration(req, res) {
    'use strict';

    var email = req.body.email,
        password = req.body.password;

    if (!email) {
        return res.status(400).json({
    error: 'The \'email\' field is missing'
});
    }
    if (!password) {
        return res.status(400).json({
            error: 'The \'password\' field is missing'
        });
    }
    User.post(email, password, function (error, user) {
        if (error) {
            logger.error('An error occured while registering a new user with email ' + email);
            logger.error(error);
            return res.status(error.code).json({
                error: error.message
            });
        }
        logger.info('A new user has been successfully registered with email ' + email);
        return res.status(201).json(user);
    });

}

exports.index = registration;
