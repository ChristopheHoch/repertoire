/* global require */

(function(User) {
   "use strict";
   
   var realm = process.env.REALM || 'http://127.0.0.1:3000',
       passport = require('passport'),
       GoogleStrategy = require('passport-google').Strategy;
   
   module.exports = passport;

   passport.serializeUser(function(user, done) {
      var email = user.emails[0].value;
      console.log("Serialize use...");
      console.log("Email: " + email);
      done(null, email);
   });

   passport.deserializeUser(function(obj, done) {
      var email = obj.emails[0].value;
      console.log("Deserialize use...");
      console.log("Email: " + email);
      User.findOne({email: email}, function(err, user) {
         if(user) {
            done(null, user);
         } else {
            throw err;
         }
      });
   });

   passport.use(new GoogleStrategy({
         returnURL: realm + '/auth/google',
         realm: realm
      },
      function(identifier, profile, done) {
         var email = profile.emails[0].value,
             firstName = profile.name.givenName,
             lastName = profile.name.familyName;
         
         User.findOne({email: email}, function(err, user) {
            if(user) {
               done(null, user);
            } else {
               user = new User();
               user.email = email;
               user.first_name = firstName;
               user.last_name = lastName;
               user.save(function(err) {
                  if(err) { 
                     throw err;
                  }
                  done(null, user);
               });
            }
         });
         
      }
   ));
   
}());