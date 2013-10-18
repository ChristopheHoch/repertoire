/* global require */

(function() {
   "use strict";

   var express = require('express'),
       http = require('http'),
       path = require('path'),
       engines = require('consolidate'),
       flash = require('connect-flash'),
       passport = require('./authentication'),
       config = require('./config'),
       app = express();

   module.exports = app;
   
   app.set('port', process.env.PORT || 3000);
   app.engine('hbs', engines.handlebars);
   app.set('view engine', 'hbs');
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
      res.render('index', { user: req.user });
   });
   
   app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
   });
   
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
   
   function ensureAuthenticated(req, res, next) {
      if (req.isAuthenticated()) {
         return next();
      }
      res.render('login');
   }

}());