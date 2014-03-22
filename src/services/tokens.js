/* global module, require */

var uuid = require('node-uuid'),
    TokenSchema = require('../models').token,
    logger = require('../logger').winston;

function Token() {}

Token.prototype.generate = function(userId, callback) {
    "use strict";
    logger.silly('Generating a new token for user id ' + userId);

    if(!userId) {
        logger.info('The user id was not provided');
        return callback({
            code: 400,
            message: 'No user were provided'
        }, null);
    }
    var token = new TokenSchema({ token: uuid.v4(), user: userId});

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