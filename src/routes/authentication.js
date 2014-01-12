/* global exports, require */

var passport = require('passport'),
    TokenService = require('../services').tokens,
    Token = new TokenService(),
    logger = require('../logger').winston;

function generateToken(req, res) {
    "use strict";
    logger.silly('Generating a new token...');
    var user = req.user;

    if(!user) {
        logger.warn('No user were found to generate a token for');
        return res.json(500, { error: 'Internal server error' });
    }

    Token.generate(user.id, function(error, token) {
        if(error) {
            logger.error('An error occured while generating a new token for user ' + user.email);
            logger.error(error);
            return res.json(error.code, { error: error.message });
        }
        logger.info('Successfully generated a token for user ' + user.id);
        return res.json(200, {
            access_token: token.token,
            token_type: 'bearer'
        });
    });
}

exports.token = [
    passport.authenticate('local', { session: false }),
    generateToken
];