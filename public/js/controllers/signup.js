App.SignupController = Ember.Controller.extend({

	reset: function() {
		this.setProperties({
			username: "",
			password: "",
			errorMessage: "",
			warnMessage: "",
			infoMessage: ""
		});
	},

	signin: function() {
		var self = this,
			data =  self.getProperties('email', 'password');
		
		self.set('errorMessage', '');
		self.set('warnMessage', '');
		self.set('infoMessage', '');
		Ember.$.post('/sign_up', data)
		.fail(function() {
			console.log('Signup failed');
		}).done(function() {
			console.log('Signup success');
		});
	}

});