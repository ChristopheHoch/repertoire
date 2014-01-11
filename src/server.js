/* global __dirname, module, require */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    config = require('./configuration'),
    db = require('./database'),
    routes = require('./routes'),
    middleware = require('./middleware'),
    app = express();

app.set('port', config.get('express:port'));
app.configure('development', function() {
    "use strict";
    app.use(express.logger({ immediate: true, format: 'dev' }));
});
app.use(express.compress());
app.use(express.methodOverride());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser(config.get('session:secret')));

app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.post('/registration', routes.registration.index);
app.get('/contacts', routes.contacts.all);

app.post('/token', routes.authentication.token);
app.use(middleware.notFound.index);

http.createServer(app).listen(app.get('port'));
module.exports = app;