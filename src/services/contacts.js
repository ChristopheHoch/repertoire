/* global module, require */

var ContactSchema = require('../models').contact,
    utils = require('./utils'),
    logger = require('../logger').winston;

function Contact() {}

Contact.prototype.all = function (callback) {
    'use strict';
    ContactSchema.find(function (error, contacts) {
        if (error) {
            return utils.raiseError(error, {
                code: 500,
                message: 'An error occured while looking for all contacts'
            }, callback);
        }
        return callback(null, contacts);
    });
};

Contact.prototype.find = function (id, callback) {
    'use strict';
    ContactSchema.findById(id, function (error, contact) {
        if (error) {
            return utils.raiseError(error, {
                code: 500,
                message: 'An error occured while looking for the contact ' + id
            }, callback);
        }
        return callback(null, contact);
    });
};

Contact.prototype.create = function (contactData, callback) {
    'use strict';

    var newContact = new ContactSchema(contactData);

    ContactSchema.create(newContact, function (error, contact) {
        if (error) {
            return utils.raiseError(error, {
                code: 500,
                message: 'An error occured while creating a contact'
            }, callback);
        }
        return callback(null, contact);
    });
};

Contact.prototype.update = function (id, update, callback) {
    'use strict';
    ContactSchema.findByIdAndUpdate(id, update, function (error, contact) {
        if (error) {
            return utils.raiseError(error, {
                code: 500,
                message: 'An error occured while deleting the contact ' + id
            }, callback);
        }
        return callback(null, contact);
    });
};

Contact.prototype.destroy = function (id, callback) {
    'use strict';
    ContactSchema.findByIdAndRemove(id, function (error, contact) {
        if (error) {
            return utils.raiseError(error, {
                code: 500,
                message: 'An error occured while deleting the contact ' + id
            }, callback);
        }
        return callback(null, contact);
    });
};

module.exports = Contact;
