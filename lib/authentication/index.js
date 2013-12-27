/* global console, module, require */
(function() {
    "use strict";

    var User = require('../models').model('User'),
        config = require('../configuration');

    function localAuthentication(username, password, done) {

        User.findOne({ email: username }, function(err, user) {
            if (err) {
                console.log(err);
                return done(err);
            }
            if (!user) {
                console.log('Incorrect username');
                return done(null, false, { message: 'Incorrect username.' });
            }

            if (user.password !== password) {
                console.log('Incorrect password.');
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });

    }

    function LocalAuth() {
        this.passport = require('passport');
        var LocalStrategy = require('passport-local').Strategy;

        this.passport.use(new LocalStrategy(localAuthentication));

        this.passport.serializeUser(function(user, done) {
            done(null, user);
        });

        this.passport.deserializeUser(function(user, done) {
            done(null, user);
        });

    }

    module.exports = new LocalAuth();

}());