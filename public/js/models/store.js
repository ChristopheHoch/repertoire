App.Adapter = DS.RESTAdapter.extend({
	ajax: function(url, type, hash) {
		hash         = hash || {};
		hash.headers = hash.headers || {};
		hash.headers['X-AUTHENTICATION-TOKEN'] = App.Session.authToken;
		hash.headers['X-AUTHENTICATION-ACCOUNT-ID'] = App.Session.authAccountId;
		return this._super(url, type, hash);
	},
	serializer: DS.RESTSerializer.extend({
		primaryKey: function (type) {
			return '_id';
		}
	})
})

App.Store = DS.Store.extend({
  adapter: 'App.Adapter'
});