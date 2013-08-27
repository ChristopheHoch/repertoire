App.SigninController = Ember.Controller.extend({

	reset: function() {
		this.setProperties({
			username: "",
			password: "",
			errorMessage: "",
//			warnMessage: "",
			infoMessage: ""
		});
	},

	signin: function() {
		var self = this,
			data =  self.getProperties('email', 'password');
		
		self.set('errorMessage', '');
		self.set('warnMessage', '');
		self.set('infoMessage', '');
		Ember.$.post('/sign_in', data).then(function(response) {
			console.log('Login response:');
			console.log(response);
			self.set('errorMessage', response.message);
			if(response.success) {
				App.Session.set('authToken', response.token);
				App.Session.set('authAccountId', response.account_id);
				
				var attemptedTransition = self.get('attemptedTransition');
				if (attemptedTransition) {
					attemptedTransition.retry();
					self.set('attemptedTransition', '');
				} else {
					self.transitionToRoute('contacts');
				}
				
			}
		});
	}

});