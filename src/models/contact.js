/* global module, require */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ContactSchema;

ContactSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String
});

module.exports = mongoose.model('Contact', ContactSchema);
