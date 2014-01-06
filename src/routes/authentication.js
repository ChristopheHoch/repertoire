/* global exports, require */

(function() {
    "use strict";

    var passport = require('passport'),
        authentication = require('../authentication'),
        Client = require('../models').client;

    exports.token = [
        passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
        authentication.server.token(),
        authentication.server.errorHandler()
    ];

}());