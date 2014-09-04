/* global __dirname, module, require */

(function () {
    'use strict';
    require('newrelic');

    var express = require('express'),
        path = require('path'),
        cookieParser = require('cookie-parser'),
        logger = require('morgan'),
        methodOverride = require('method-override'),
        session = require('express-session'),
        bodyParser = require('body-parser'),
        multer = require('multer'),
        errorHandler = require('errorhandler'),
        passport = require('./authentication').passport,
        config = require('./configuration'),
        db = require('./database'),
        routes = require('./routes'),
        middleware = require('./middleware'),
        app = express();

    app.set('port', config.get('express:port'));
    if ('development' === app.get('env')) {
        app.use(errorHandler());
        app.use(logger({
            immediate: true,
            format: 'dev'
        }));
    }
    app.use(methodOverride());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(session({
        secret: config.get('session:secret')
    }));
    app.use(cookieParser());

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(path.join(__dirname, 'public')));

    app.post('/registration', routes.registration.index);
    app.get('/contacts', routes.contacts.all);

    app.post('/token', routes.authentication.token);
    app.use(middleware.notFound.index);

    app.listen(app.get('port'));
    module.exports = app;
}());
