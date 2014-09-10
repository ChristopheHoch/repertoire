/* global console, exports, require */

var ContactService = require('../services').contacts,
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
            logger.error(error);
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

exports.all = findAllContacts;
exports.find = findOneContact;
