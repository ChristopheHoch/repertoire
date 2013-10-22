/* global require */

(function() {
   "use strict";

   var express = require('express'),
       http = require('http'),
       path = require('path'),
       flash = require('connect-flash'),
       mongoose = require('mongoose'),
       Schema = mongoose.Schema,
       UserSchema,
       User,
//       passport = require('./authentication'),
       realm = process.env.REALM || 'http://127.0.0.1:3000',
       passport = require('passport'),
       GoogleStrategy = require('passport-google').Strategy,
       sign = require('./routes/sign'),
       app = express(),
       port = process.env.PORT || 3000,
       db = process.env.MONGODB_URL || "mongodb://localhost/repertoire";

   module.exports = app;
   
   /**
    * Mongoose
    */
   UserSchema = new Schema({
      email: String,
      first_name: String,
      last_name: String,
   });

   mongoose.connect(db);
   mongoose.model('User', UserSchema);
   
   User = mongoose.model('User');
   
   /**
    * Passport
    */
   passport.serializeUser(function(user, done) {
      done(null, user.id);
   });

   passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
         done(err, user);
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
               var user = new User();
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
         })
         
      }
   ));
   
   /**
    * Express JS
    */
   app.set('port', port);
   app.set('view engine', 'jade');
   app.set('views', __dirname + '/views');
   app.use(express.logger('dev'));
   app.use(express.favicon());
   app.use(express.json());
   app.use(express.urlencoded());
   app.use(express.methodOverride());
   app.use(express.cookieParser());
   app.use(express.session({ secret: 'The answer is 42' }));
   app.use(flash());
   app.use(passport.initialize());
   app.use(passport.session());
   app.use(app.router);
   app.use(express.static(path.join(__dirname, 'public')));

   app.get('/', ensureAuthenticated, function(req, res){
      console.log(req.user);
      res.render('index', { user: req.user });
   });
   
   app.post('/auth/google', passport.authenticate('google'));
   app.get('/auth/google', 
           passport.authenticate('google', {
              successRedirect: '/',
              failureRedirect: '/'
           }));

   app.post('/signout', sign.signout);
   
   if ('development' == app.get('env')) {
      app.use(express.errorHandler());
   }

   http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
   });
   
   function ensureAuthenticated(req, res, next) {
      if (req.isAuthenticated()) {
         return next();
      }
      res.render('signin', { message: req.flash('error') });
   }

}());