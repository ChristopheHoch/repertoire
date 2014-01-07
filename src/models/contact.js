/* global module, require */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ContactSchema;

ContactSchema = new Schema({
    first_name : String,
    last_name  : String,
    email      : String
});

module.exports = mongoose.model('Contact', ContactSchema);