/* global module, require */

var ContactSchema = require('../models').contact;

function Contact() {}

Contact.prototype.all = function(callback) {
    "use strict";
    //        ContactSchema.find(function(error, contacts) {
    //            if(error) {
    //                return callback({
    //                    code: 500,
    //                    message: 'Internal Server Error'
    //                }, null);
    //            }
    //            return callback(null, contacts);
    //        });
};

module.exports = Contact;