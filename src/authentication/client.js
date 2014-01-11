/* global require */

var passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    BearerStrategy = require('passport-http-bearer').Strategy,
    UserSchema = require('../models').user,
    TokenSchema = require('../models').token;

function handleBasicStrategy(email, password, done) {
    "use strict";

    console.log('handleBasicStrategy(email: ' + email + ', password: ' + password + ')');
    if(!email) {
        return done("The 'email' field is missing");
    }
    if(!password) {
        return done("The 'password' field is missing");
    }
    UserSchema.findOne({"email" : email}, function(err, user) {
        if(err) {
            return done(err);
        }
        if(!user) {
            return done(null, false);
        }
        if(user.password != password) {
            return done(null, false);
        }
        return done(null, user);
    });
}

function handleBearerStrategy(token, done) {
    "use strict";

    if(!token) {
        return done("The 'token' field is missing");
    }
    TokenSchema.findOne({ token: token }, function (err, user) {
        if(err) {
            return done(err);
        }
        if(!user) {
            return done(null, false);
        }
        return done(null, user, { scope: 'all' });
    });
}

passport.use(new BasicStrategy(handleBasicStrategy));

passport.use(new BearerStrategy(handleBearerStrategy));