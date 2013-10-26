(function() {
   "use strict";
   
   window.App = Ember.Application.create({
      LOG_TRANSITIONS: true
   });
   
   App.Contact = DS.Model.extend({
      firstName: DS.attr('string'),
      lastName: DS.attr('string'),
      email: DS.attr('string'),
      
      fullName: function() {
         return this.get('firstName') + ' ' + this.get('lastName');
      }.property('firstName', 'lastName')
   });
   
   App.Router.map(function() {
      this.resource('contacts');
/*      this.resource('contacts', { path: '/' }, function() {
         this.route('new');
         this.resource('contact', { path: '/:contact_id' }, function() {
            this.route('edit');
         });
      });*/
   });
   
   App.ContactsRoute = Ember.Route.extend({
      model: function(params) {
         return this.get('store').findAll('contact');
      }
   });
   
   App.ContactRoute = Ember.Route.extend({
      model: function(params) {
         return this.get('store').find('contact', params.contact_id);
      }
   });
   
}()); 