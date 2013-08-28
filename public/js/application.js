window.App = Ember.Application.create({
	LOG_TRANSITIONS: true, // basic logging of successful transitions
	LOG_TRANSITIONS_INTERNAL: true // detailed logging of all routing steps
});

Ember.Application.initializer({
	name: 'session',
 
	initialize: function(container, application) {
		
		App.Session = Ember.Object.extend({
			
			authToken: localStorage.authToken,
			authAccountId: localStorage.authAccountId,

			authTokenChanged: function() {
				localStorage.authToken = this.authToken;
			}.observes('authToken'),
 
			authAccountIdChanged: function() {
				localStorage.authAccountId = this.authAccountId;
			}.observes('authAccountId')
										  
		}).create();
		
	}
});