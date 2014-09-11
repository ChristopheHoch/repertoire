/* global module, require */

var ContactSchema = require('../models').contact,
    logger = require('../logger').winston;

function Contact() {}

Contact.prototype.all = function (callback) {
    'use strict';
    ContactSchema.find(function (error, contacts) {
        if (error) {
            logger.error('An error occured while looking for all contacts');
            logger.error(error);
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
            logger.error('An error occured while looking for the contact ' + id);
            logger.error(error);
            return callback({
                code: 500,
                message: 'Internal Server Error'
            }, null);
        }
        return callback(null, contact);
    });
};

Contact.prototype.create = function (contactData, callback) {
    'use strict';

    var newContact = new ContactSchema(contactData);

    ContactSchema.create(newContact, function (error, contact) {
        if (error) {
            logger.error('An error occured while creating a contact');
            logger.error(contactData);
            logger.error(error);
            return callback({
                code: 500,
                message: 'Internal Server Error'
            }, null);
        }
        return callback(null, contact);
    });
};

module.exports = Contact;
