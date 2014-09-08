/* global module, require */

var ContactSchema = require('../models').contact,
    logger = require('../logger').winston;

function Contact() {}

Contact.prototype.all = function (callback) {
    'use strict';
    logger.silly('Finding all contacts...');
    ContactSchema.find(function (error, contacts) {
        if (error) {
            return callback({
                code: 500,
                message: 'Internal Server Error'
            }, null);
        }
        return callback(null, contacts);
    });
};

module.exports = Contact;
