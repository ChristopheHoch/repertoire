var App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

// Router
App.Router.map(function() {
  // this.resource('user', { path: ':user_id' }, function() {
  //   this.route('edit');
  // });
  // this.resource('contact', { path: ':contact_id' }, function() {
  //   this.route('new');
  //   this.route('edit');
  // });
});

// Routes
// App.UsersRoute = Ember.Route.extend({
//   model: function() {
//     return App.User.find();
//   },
//   redirect: function() {
//     var isAuthenticate = this.controllerFor('application').get('isAuthenticate');
//     if(!isAuthenticate) {
//       this.transitionTo('index');
//     }
//   }
// });
// App.UserRoute = Ember.Route.extend({
//   model: function(params) {
//     return App.User.find(params.user_id);
//   }
// });

// Controler
// App.ApplicationController = Ember.Controller.extend({

// });

App.IndexController = Ember.Controller.extend({
  needs: ['navbar']
});

App.NavbarController = Ember.Controller.extend({
  isAuthenticate: false,
  email: '',
  password: '',
  firstName: 'Christophe',
  lastName: 'Hoch',

  signin: function() {
    console.log('Before sign in');
    $.post("http://localhost:3000/login", { email: this.get('email'), password: this.get('password') } );
    console.log('After sign in');
    this.set('isAuthenticate', true)
  },

  signout: function() {
    this.set('isAuthenticate', false)
  }
});

App.SignupController = Ember.ObjectController.extend({
  email: '',
  password: '',

  signup: function() {
    $.post("http://localhost:3000/signup", { email: this.get('email'), password: this.get('password') } );
  }

});

// App.UserController = Ember.ObjectController.extend({
//   isEditing: false,

//   edit: function() {
//     this.set('isEditing', true)
//   },

//   done: function() {
//     this.set('isEditing', false)
//   }
// });

// Model
App.Adapter = DS.RESTAdapter.extend({
  serializer: DS.RESTSerializer.extend({
    primaryKey: function (type){
      return '_id';
   }
  })
});

App.Store = DS.Store.extend({
  revision: 12,
  adapter: 'App.Adapter'
});

App.User = DS.Model.extend({
  _id: DS.attr('string'),
  email: DS.attr('string'),
  password: DS.attr('string'),
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  // contacts: DS.hasMany('App.Contact')
});
// App.Contact = DS.Model.extend({
//   _id: DS.attr('string'),
//   user: DS.belongsTo('App.User'),
//   firstName: DS.attr('string'),
//   lastName: DS.attr('string'),
//   email: DS.attr('string'),
//   mobilePhone: DS.attr('string'),
//   address: DS.attr('string'),
//   postcode: DS.attr('string'),
//   city: DS.attr('string'),
//   country: DS.attr('string')
// });

// View
