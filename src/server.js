/* global require */

(function() {
   "use strict";

   var express = require('express'),
       http = require('http'),
       path = require('path'),
       flash = require('connect-flash'),
       passport = require('./authentication'),
       sign = require('./routes/sign'),
       config = require('./config'),
       app = express();

   module.exports = app;
   
   app.set('port', process.env.PORT || 3000);
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
      res.render('index', { user: req.user });
   });

   app.post('/signin',
            passport.authenticate('local', {
               failureRedirect: '/',
               failureFlash: true
               }),
            sign.signin);
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