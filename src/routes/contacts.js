/* global console, exports, require */

(function() {
    "use strict";

    var ensureLoggedIn = require('../middleware').ensureLoggedIn,
        ContactService = require('../services').contacts,
        Contact = new ContactService();

    function contactsAll(req, res) {
        console.log('Request.' + req.url);

        Contact.all(function(error, contacts) {
            if(error) {
                return res.json(error.code, { error: error.message });
            }
            if(!contacts) {
                contacts = {};
            }
            return res.json(200, contacts);
        });

    }

    exports.all = [
        ensureLoggedIn.index,
        contactsAll
    ];

    exports.get = function(req, res) {
        console.log('contacts.get');
    };

    exports.post = function(req, res) {
        console.log('contacts.post');
    };

    exports.put = function(req, res) {
        console.log('contacts.put');
    };

    exports.del = function(req, res) {
        console.log('contacts.del');
    };

}());