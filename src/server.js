/* global require */

(function() {
   "use strict";

   var express = require('express'),
       http = require('http'),
       path = require('path'),
       passport = require('./authentication'),
       config = require('./config'),
       app = express();

   module.exports = app;
   
   app.set('port', process.env.PORT || 3000);
   app.use(express.logger('dev'));
   app.use(express.json());
   app.use(express.urlencoded());
   app.use(express.methodOverride());
   app.use(express.cookieParser());
   app.use(express.session({ secret: 'The answer is 42' }));
   app.use(passport.initialize());
   app.use(passport.session());
   app.use(express.static(path.join(__dirname, 'public')));
   
   app.get('/', ensureAuthenticated, function(req, res){
      res.render('index', { user: req.user });
   });

   app.get('/login', function(req, res){
      res.render('login', { user: req.user, message: req.flash('error') });
   });
   
   function ensureAuthenticated(req, res, next) {
      if (req.isAuthenticated()) {
         return next();
      }
      res.redirect('/login.html');
   }
   
   app.post('/login', passport.authenticate('local',
      {
         failureRedirect: '/login',
         failureFlash: true
      }),
     function(req, res) {
       res.redirect('/');
    });
   
   if ('development' == app.get('env')) {
      app.use(express.errorHandler());
   }

   http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
   });

}());