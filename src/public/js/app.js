/* global $, DS, Ember */

Ember.Application.initializer({
    name: 'authentication',
    initialize: function(container, application) {
        "use strict";
        Ember.SimpleAuth.setup(container, application);
    }
});

var App = Ember.Application.create({
    LOG_TRANSITIONS: true
});

/**
  * MODEL
  */
App.Contact = DS.Model.extend({
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    email: DS.attr('string'),

    fullName: function() {
        "use strict";
        return this.get('firstName') + ' ' + this.get('lastName');
    }.property('firstName', 'lastName')
});

/**
  * ROUTES
  */
App.Router.map(function() {
    "use strict";
    this.resource('login');
    this.resource('register');
    this.resource('contacts');
});

App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin);

App.ContactsRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    model: function(params) {
        "use strict";
        return this.get('store').findAll('contact');
    }
});

/**
  * CONTROLLER
  */
App.RegisterController  = Ember.ObjectController.extend({
    email: '',
    password: '',

    actions: {
        register: function() {
            "use strict";
            console.log(this.get('email') + '/' + this.get('password'));
            $.post('/registration', { 'email': this.get('email'), 'password': this.get('password') }, function(data) {
                console.log(data);
            });
        }
    }
});

App.LoginController  = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin);