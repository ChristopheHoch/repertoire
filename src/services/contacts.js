/* global module, require */

var ContactSchema = require('../models').contact,
    logger = require('../logger').winston;

function Contact() {}

Contact.prototype.all = function (callback) {
    'use strict';
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

Contact.prototype.find = function (id, callback) {
    'use strict';
    ContactSchema.findById(id, function (error, contact) {
        if (error) {
            return callback({
                code: 500,
                message: 'Internal Server Error'
            }, null);
        }
        return callback(null, contact);
    });
};

module.exports = Contact;
