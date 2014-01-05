/* global exports, require */

(function() {
    "use strict";

    var passport = require('passport'),
        authentication = require('../authentication'),
        Client = require('../models').model('Client');

    exports.login = function(req, res) {
        console.log('authentication.login');
    };

    exports.logout = function(req, res  ) {
        console.log('authentication.logout');
    };

    exports.token = [
        passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
        authentication.server.token(),
        authentication.server.errorHandler()
    ];

}());