App.ContactController = Ember.ObjectController.extend({
	isEditing: false,

	editContact: function () {
		this.set('isEditing', true);
	},

	saveChanges: function () {
		var self = this
		  , contact = this.get('model')
		  , url = '/contacts/' + contact._id
		  , token = App.Session.get('authToken')
		  , account_id = App.Session.get('authAccountId')
		  , data;

		data = {
			token: token,
			account_id: account_id,
			contact: {
				first_name: contact.first_name,
				last_name: contact.last_name,
				email: contact.email,
			}
		};

		Ember.$.ajax({
			type: "PUT",
			url: url,
			data: data
		}).done(function () {
			self.set('isEditing', false);
		}).fail(function() {
			console.log('To be implemented...');
			self.set('isEditing', false);
		});

	},
	
	discardChanges: function () {
		console.log('To be implemented...');
		this.set('isEditing', false);
	}
});