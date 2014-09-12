/* global console, exports, require */

var _ = require('underscore'),
    ContactService = require('../services').contacts,
    Contact = new ContactService(),
    logger = require('../logger').winston;

function findAllContacts(req, res) {
    'use strict';

    Contact.all(function (error, contacts) {
        if (error) {
            return res.status(error.code).json({
                error: error.message
            });
        }
        if (!contacts) {
            contacts = {};
        }
        return res.status(200).json(contacts);
    });
}

function findOneContact(req, res) {
    'use strict';

    var userId = req.params.id;
    if (typeof userId === 'undefined') {
        return res.status(400).json({
            error: 'The \'userId\' field is missing'
        });
    }

    Contact.find(userId, function (error, contact) {
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

    var body = req.body,
        firstName = body.firstName,
        lastName = body.lastName,
        email = body.email,
        contactData = {};

    if (typeof firstName === 'undefined' &&
        typeof lastName === 'undefined' &&
        typeof email === 'undefined') {
        return res.status(400).json({
            error: 'At least one information about the contact should be given'
        });
    }

    if (firstName) {
        _.extend(contactData, {
            firstName: firstName
        });
    }
    if (lastName) {
        _.extend(contactData, {
            lastName: lastName
        });
    }
    if (email) {
        _.extend(contactData, {
            email: email
        });
    }

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


exports.all = findAllContacts;
exports.find = findOneContact;
exports.create = createContact;
