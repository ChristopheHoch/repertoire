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
			
//			init: function() {
//				this._super();
//				this.set('authToken', localStorage.authToken);
//				this.set('authAccountId', localStorage.authAccountId);
//			},
 
			authTokenChanged: function() {
				console.log('authTokenChanged');
//				var authToken       = this.get('authToken');
//				App.Store.authToken = authToken;
//				$.cookie('auth_token', authToken);
				localStorage.authToken = this.authToken;
			}.observes('authToken'),
 
			authAccountIdChanged: function() {
				console.log('authAccountIdChanged');
//				var authAccountId = this.get('authAccountId');
//				$.cookie('auth_account', authAccountId);
				localStorage.authAccountId = this.authAccountId;
//				if (!Ember.isEmpty(authAccountId)) {
//					this.set('authAccount', App.Account.find(authAccountId));
//				}
			}.observes('authAccountId')
										  
		}).create();
		
	}
});