/* global module, require */

(function() {
    "use strict";

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ClientSchema;

    ClientSchema = new Schema({
        name: String,
        clientKey: String,
        clientSecret: String
    });

    module.exports = mongoose.model('Client', ClientSchema);

}());