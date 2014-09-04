/* global exports, require */

var winston = require('winston'),
    logger = new(winston.Logger)({
        transports: [
            new(winston.transports.Console)({
                level: 'silly',
                timestamp: true
            })
        ]
    });

exports.winston = logger;
