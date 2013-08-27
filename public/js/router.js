App.Router.map(function () {
	this.route('signin');
	this.route('signout');
	this.route('signup');
	this.route('contacts');
});

App.SigninRoute = Ember.Route.extend({
	setupController: function (controller, context) {
		controller.reset();
	}
});

App.SignoutRoute = Ember.Route.extend({
	renderTemplate: function(controller, model) {
		controller.signout();
	}
});

App.AuthenticatedRoute = Ember.Route.extend({

	beforeModel: function(transition) {
		var authToken = App.Session.get('authToken');
		if (!authToken || 0 === authToken.length || authToken == "null") {	
			this.redirectToSignin(transition);
		}
	},
	
	redirectToSignin: function(transition) {
		var signinController = this.controllerFor('signin');
		signinController.set('attemptedTransition', transition);
		signinController.set('warnMessage', 'You must sign in first.');
		this.transitionTo('signin');
	},
	
	getJSONWithToken: function(url) {
		var token = App.Session.get('authToken');
		var account_id = App.Session.get('authAccountId');
		return $.getJSON(url, { token: token, account_id: account_id });
	},
 
	events: {
		error: function(reason, transition) {
			if (reason.status === 401) {
				this.redirectToSignin(transition);
			} else {
				console.log('Something went wrong:');
				console.log(reason);
			}
		}
	}

});

App.ContactsRoute = App.AuthenticatedRoute.extend({
	model: function () {
		return this.getJSONWithToken('/contacts');
	}
});