/* global module, require */

(function() {
    "use strict";

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ContactSchema,
        UserSchema,
        ClientSchema,
        AuthorizationCodeSchema,
        AccessTokenSchema;

    ContactSchema = new Schema({
        first_name : String,
        last_name  : String,
        email      : String
    });

    UserSchema = new Schema({
        email    : String,
        password : String,
        contacts : [ ContactSchema ]
    });

    ClientSchema = new Schema({
        name: String,
        clientKey: String,
        clientSecret: String
    });

    AuthorizationCodeSchema = new Schema({
        created: {
            type: Date,
            default: Date.now
        },
        code: String,
        redirectUri: String,
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        client: {
            type: Schema.ObjectId,
            ref: 'Client'
        },
    });

    AccessTokenSchema = new Schema({
        created: {
            type: Date,
            default: Date.now
        },
        token: String,
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        client: {
            type: Schema.ObjectId,
            ref: 'OAuthClient'
        }
    });

    mongoose.model('Contact', ContactSchema);
    mongoose.model('User', UserSchema);
    mongoose.model('Client', ClientSchema);
    mongoose.model('AuthorizationCode', AuthorizationCodeSchema);
    mongoose.model('AccessToken', AccessTokenSchema);
    module.exports = mongoose;

}());