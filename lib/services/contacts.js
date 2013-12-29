/* global __dirname, module, require */

(function() {
    "use strict";

    var ContactSchema = require('../models').model('Contact');

    function Contact() {}

    Contact.prototype.all = function(callback){
        ContactSchema.find(function(error, contacts) {
            if (error) return callback(error, null);
            return callback(null, contacts);
        });
    };

    module.exports = Contact;

}());