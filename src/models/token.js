/* global module, require */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    TokenSchema;

TokenSchema = new Schema({
    token: String,
    created: {
        type: Date,
        default: Date.now,
        expires: '24h'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Token', TokenSchema);