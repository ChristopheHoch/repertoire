/* global exports, require */

var UserService = require('../services').users,
    User = new UserService(),
    logger = require('../logger').winston;

function registration(req, res) {
    "use strict";

    logger.silly('Registering a new user...');
    var email = req.body.email,
        password = req.body.password;

    if(!email) {
        logger.verbose('The email field is missing');
        return res.json(400, { error: "The 'email' field is missing" });
    }
    if(!password) {
        logger.verbose('The password field is missing');
        return res.json(400, { error: "The 'password' field is missing" });
    }
    User.post(email, password, function(error, user) {
        if(error) {
            logger.error('An error occured while registering a new user with email ' + email);
            logger.error(error);
            return res.json(error.code, { error: error.message });
        }
        logger.info('A new user has been successfully registered with email ' + email);
        return res.json(201, user);
    });

}

exports.index = registration;