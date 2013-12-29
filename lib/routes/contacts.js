/* global console, exports, require */

(function() {
    "use strict";

    var ContactService = require('../services').contacts,
        Contact = new ContactService();

    exports.all = function(req, res) {
        console.log('Request.' + req.url);

        Contact.all(function(error, contacts) {
            if(error) {
                return res.json(500, 'Internal Server Error');
            }
            if(!contacts) {
                contacts = {};
            }
            return res.json(200, contacts);
        });

    };

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