/* global exports, require */

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    BearerStrategy = require('passport-http-bearer').Strategy,
    UserSchema = require('./models').user,
    TokenSchema = require('./models').token,
    logger = require('./logger').winston;

function handleLocalStrategy(username, password, done) {
    "use strict";
    logger.silly('handleLocalStrategy(username: ' + username + ', password: ' + password + ')');
    if(!username) {
        logger.verbose('The email field is missing');
        return done("The 'email' field is missing");
    }
    if(!password) {
        logger.verbose('The password field is missing');
        return done("The 'password' field is missing");
    }
    UserSchema.findOne({"email" : username}, function(err, user) {
        if(err) {
            logger.error('An error occured while looking for user ' + username);
            logger.error(err);
            return done(err);
        }
        if(!user) {
            logger.info('No user were found with email ' + username);
            return done(null, false);
        }
        if(user.password != password) {
            logger.info('Incorrect password given for email ' + username);
            return done(null, false);
        }
        logger.info('The user ' + username + ' is now logged in');
        return done(null, user);
    });
}

function handleBearerStrategy(token, done) {
    "use strict";

    logger.silly('handleBearerStrategy(token: ' + token + ')');
    if(!token) {
        logger.verbose('The token field is missing');
        return done("The 'token' field is missing");
    }
    TokenSchema.findOne({ token: token }, function (err, user) {
        if(err) {
            logger.error('An error occured while looking for token ' + token);
            logger.error(err);
            return done(err);
        }
        if(!user) {
            logger.info('No user were found with token ' + token);
            return done(null, false);
        }
        logger.info('The user ' + user.email + ' has been retrieved for token ' + token);
        return done(null, user, { scope: 'all' });
    });
}

passport.use(new LocalStrategy(handleLocalStrategy));
passport.use(new BearerStrategy(handleBearerStrategy));

exports.passport = passport;