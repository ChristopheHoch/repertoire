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
            return res.json(error.code, {
                error: error.message
            });
        }
        if (!contacts) {
            contacts = {};
        }
        return res.json(200, contacts);
    });
}

exports.all = contactsAll;
