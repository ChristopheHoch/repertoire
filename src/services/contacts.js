/* global module, require */

(function() {
    "use strict";

    var ContactSchema = require('../models').model('Contact');

    function Contact() {}

    Contact.prototype.all = function(callback) {
        ContactSchema.find(function(error, contacts) {
            if(error) {
                return callback({
                    code: 500,
                    message: 'Internal Server Error'
                }, null);
            }
            return callback(null, contacts);
        });
    };

    module.exports = Contact;

}());