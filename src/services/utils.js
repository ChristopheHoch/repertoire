/* global exports, require */

var logger = require('../logger').winston;

function raiseError(err, msg, callback) {
    "use strict";
    logger.error(msg);
    if(err) {
        logger.error(err);
    }
    return callback(msg);
}

exports.raiseError = raiseError;