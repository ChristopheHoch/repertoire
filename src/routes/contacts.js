/* global console, exports, require */

var _ = require('underscore'),
    utils = require('../services').utils,
    ContactService = require('../services').contacts,
    Contact = new ContactService(),
    logger = require('../logger').winston;

function extractContactData(body) {
    'use strict';

    var contactData = {};
    if (body) {
        utils.extendObject('firstName', body.firstName, contactData);
        utils.extendObject('lastName', body.lastName, contactData);
        utils.extendObject('email', body.email, contactData);
        utils.extendObject('address', body.address, contactData);
        utils.extendObject('location', body.location, contactData);
    }
    return contactData;
}

function findAllContacts(req, res) {
    'use strict';

    Contact.all(function (error, contacts) {
        if (error) {
            return res.status(error.code).json({
                error: error.message
            });
        }
        return res.status(200).json(contacts);
    });
}

function findOneContact(req, res) {
    'use strict';

    var contactId = req.params.id;

    Contact.find(contactId, function (error, contact) {
        if (error) {
            return res.status(error.code).json({
                error: error.message
            });
        }
        if (!contact) {
            return res.status(404).end();
        }
        return res.status(200).json(contact);
    });
}

function createContact(req, res) {
    'use strict';

    var contactData = extractContactData(req.body);
    if (_.isEmpty(contactData)) {
        return res.status(400).json({
            error: 'At least one information about the contact should be given'
        });
    }

    Contact.create(contactData, function (error, contact) {
        if (error) {
            return res.status(error.code).json({
                error: error.message
            });
        }
        if (!contact) {
            return res.status(500).end();
        }
        return res.status(200).json(contact);
    });
}

function updateContact(req, res) {
    'use strict';

    var contactId = req.params.id,
        contactData;

    if (typeof contactId === 'undefined') {
        return res.status(400).json({
            error: 'The \'userId\' field is missing'
        });
    }

    contactData = extractContactData(req.body);
    if (_.isEmpty(contactData)) {
        return res.status(400).json({
            error: 'At least one information about the contact should be given'
        });
    }

    Contact.update(contactId, contactData, function (error, contact) {
        if (error) {
            return res.status(error.code).json({
                error: error.message
            });
        }
        if (!contact) {
            return res.status(404).end();
        }
        return res.status(200).json(contact);
    });
}

function destroyContact(req, res) {
    'use strict';

    var contactId = req.params.id;
    if (typeof contactId === 'undefined') {
        return res.status(400).json({
            error: 'The \'userId\' field is missing'
        });
    }

    Contact.destroy(contactId, function (error, contact) {
        if (error) {
            return res.status(error.code).json({
                error: error.message
            });
        }
        if (!contact) {
            return res.status(404).end();
        }
        return res.status(200).end();
    });
}

exports.all = findAllContacts;
exports.find = findOneContact;
exports.create = createContact;
exports.update = updateContact;
exports.destroy = destroyContact;
