var App = Ember.Application.create();

// Router
App.Router.map(function() {
  this.resource('users', function() {
    this.resource('user', { path: ':user_id' });
  });
  this.resource('events');
});

App.Adapter = DS.RESTAdapter.extend({
  serializer: DS.RESTSerializer.extend({
    primaryKey: function (type){
      return '_id';
   }
  })
});

// Store
App.Store = DS.Store.extend({
  revision: 12,
  adapter: 'App.Adapter'
});

// Routes
App.UsersRoute = Ember.Route.extend({
  model: function() {
    return App.User.find();
  }
});
App.UserRoute = Ember.Route.extend({
  model: function(params) {
    return App.User.find(params.user_id);
  }
});

// Model
App.User = DS.Model.extend({
  _id: DS.attr('string'),
  firstName: DS.attr('string'),
  lastName: DS.attr('string')
});

// Controler
App.UserController = Ember.ObjectController.extend({
  isEditing: false,

  edit: function() {
    this.set('isEditing', true)
  },

  done: function() {
    this.set('isEditing', false)
  }
});

// View
