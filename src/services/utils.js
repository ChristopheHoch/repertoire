/* global exports, require */

var _ = require('underscore'),
    logger = require('../logger').winston;

function raiseError(err, msg, callback) {
    'use strict';
    logger.error(msg);
    if (err) {
        logger.error(err);
    }
    return callback(msg);
}

function extendObject(key, value, object) {
    'use strict';
    var objectExtension = {};
    if (value) {
        objectExtension[key] = value;
        _.extend(object, objectExtension);
    }
}

exports.raiseError = raiseError;
exports.extendObject = extendObject;
