/* global exports, require */

(function() {
    "use strict";

    var passport = require('passport'),
        authentication = require('../authentication'),
        Client = require('../models').model('Client');

    function authorize(clientID, redirectURI, done) {
        Client.findOne(clientID, function(err, client) {
            if(err) {
                return done(err);
            }
            if(!client) {
                return done(null, false);
            }
            if(client.redirectUri != redirectURI) {
                return done(null, false);
            }
            return done(null, client, client.redirectURI);
        });
    }

    exports.login = function(req, res) {
        console.log('authentication.login');
    };

    exports.logout = function(req, res  ) {
        console.log('authentication.logout');
    };

    exports.authorization = [
        authentication.server.authorize(authorize)
    ];

    exports.token = [
        passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
        authentication.server.token(),
        authentication.server.errorHandler()
    ];

}());