/* global module, require */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ContactSchema;

ContactSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    address: String,
    location: {
        'type': {
            type: String
        },
        coordinates: [
            {
                type: 'Number'
            }
        ]
    }
});

ContactSchema.pre('save', function (next) {
    'use strict';

    if (0 === this.location.coordinates.length) {
        this.location = undefined;
    }
    next();
});

module.exports = mongoose.model('Contact', ContactSchema);
