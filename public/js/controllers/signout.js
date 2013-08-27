App.SignoutController = Ember.Controller.extend({
	
	redirectToSignin: function(transition) {
		App.Session.set('authToken', '');
		App.Session.set('authAccountId', '');
		this.transitionToRoute('signin');
	},

	signout: function() {
		var self = this
		  , token = App.Session.get('authToken')
		  , account_id = App.Session.get('authAccountId')
		  , data = { token: token, account_id: account_id };
		
		if(!token || !account_id) {
			redirectToSignin();
		}

		Ember.$.post('/sign_out', data).then(function(response) {
			console.log('Sign out response:');
			console.log(response);
			
			redirectToSignin();

		});
	}
	
});