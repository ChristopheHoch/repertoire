/* global console, exports, require */

var ContactService = require('../services').contacts,
    Contact = new ContactService(),
    logger = require('../logger').winston;

function contactsAll(req, res) {
    'use strict';
    logger.silly('Finding all contacts...');
    logger.silly(req.user.contacts);

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

exports.all = contactsAll;
