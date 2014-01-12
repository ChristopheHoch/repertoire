/* global exports, require */

var logentries = require('node-logentries'),
    winston = require('winston'),
    log = logentries.logger({
        token: 'aae06362-42b7-4463-b68d-be2cacc409c7'
    }),
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                level: 'silly',
                timestamp: true
            })
        ]
    });

log.winston(winston, {level: 'silly'});

exports.winston = logger;