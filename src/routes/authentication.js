/* global exports, require */

var jwt = require('jsonwebtoken'),
    config = require('../configuration'),
    UserService = require('../services').users,
    User = new UserService(),
    logger = require('../logger').winston;

function authenticate(req, res) {
    'use strict';
    logger.silly('Generating a new token...');

    var email = req.body.email,
        password = req.body.password;

    if (!email || !password) {
        logger.verbose('The email or password field is missing');
        return res.status(401).json({
            error: 'Incorrect login'
        });
    }

    User.findByEmail(email, function (err, user) {

        if (err) {
            logger.error('An error occured while fetching the user: ' + email);
            logger.error(err);
            return res.status(401).json({
                error: 'Incorrect login'
            });
        }

        if (user.password !== password) {
            logger.info('Incorrect login of user: ' + email);
            return res.status(401).json({
                error: 'Incorrect login'
            });
        }

        // We are sending the profile inside the token
        var token = jwt.sign(user, config.get('session:secret'), {
            expiresInMinutes: 60 * 5
        });

        res.json({
            token: token
        });

    });

}

exports.index = authenticate;
