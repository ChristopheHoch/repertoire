/* global require */

(function() {
   "use strict";
   
   var realm = process.env.REALM || 'http://127.0.0.1:3000',
       passport = require('passport'),
       GoogleStrategy = require('passport-google').Strategy;
   
   module.exports = passport;

   passport.serializeUser(function(user, done) {
      console.log(user);
      done(null, user);
   });

   passport.deserializeUser(function(obj, done) {
      done(null, obj);
   });

   passport.use(new GoogleStrategy({
         returnURL: realm + '/auth/google',
         realm: realm
      },
      function(identifier, profile, done) {
//         User.findOrCreate({ openId: identifier }, function(err, user) {
//            done(err, user);
//         });
         process.nextTick(function () {
             done(null, profile);
         });
      }
   ));
   
}());