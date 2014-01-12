/* global module, require */

var uuid = require('node-uuid'),
    TokenSchema = require('../models').token,
    logger = require('../logger').winston;

function Token() {}

Token.prototype.generate = function(user, callback) {
    "use strict";
    logger.silly('Generating a new token...');

    if(!user) {
        logger.info('The user data was not provided');
        return callback({
            code: 400,
            message: 'No user were provided'
        }, null);
    }
    var token = new TokenSchema({ token: uuid.v4(), user: user.id});

    token.save(function(error, savedToken) {
        if(error) {
            logger.error('An error occured while saving the token ' + token.token + ' for user ' + token.user);
            logger.error(error);
            return callback({
                code: 500,
                message: 'Error while saving the token'
            }, null);
        }
        logger.info('A new token has been successfully generated for user ' + savedToken.user + ': ' + savedToken.token);
        return callback(null, savedToken);
    });

};

module.exports = Token;