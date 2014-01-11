/* global exports, require */

var passport = require('passport'),
    authentication = require('../authentication').server,
    Client = require('../models').client;

exports.token = [
    passport.authenticate('basic', { session: false }),
    authentication.server.token(),
    authentication.server.errorHandler()
];