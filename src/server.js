
/**
 * Module dependencies.
 */

var express = require('express'),
  colors = require('colors'),
	mongoose = require('mongoose'),
	uuid = require('node-uuid'),
  passport = require('passport'),
  GoogleStrategy = require('passport-google').Strategy,
	config = require('./config'),
	http = require('http'),
	path = require('path'),
	app,
	db;

app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.session({ secret: 'Le chat est en plastique' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// *********************************
// Configuring Google Authentication
passport.use(new GoogleStrategy({
    returnURL: 'http://chris-box-36582.euw1.actionbox.io:3000/auth/google/return',
    realm: 'http://chris-box-36582.euw1.actionbox.io:3000/'
  },
  function(identifier, profile, done) {
    User.findOrCreate({ openId: identifier }, function(err, user) {
      done(err, user);
    });
  }
));

// Serialized and deserialized methods when got from session
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Define a middleware function to be used for every secured routes
var auth = function(req, res, next){
  if (!req.isAuthenticated()) {
    console.log('User not authenticated!'.red);
  	res.send(401);
  } else {
    console.log('User not authenticated!'.blue);
  	next();
  }
};

app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/return', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));
// *********************************

// connection to MongoDB
mongoose.connect(config.creds.mongoose_auth);

db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function callback() {
	console.log("Connection openned...".green);

	var UserSchema = mongoose.Schema({
		email: String,
		password: String
	});
	var User = mongoose.model('User', UserSchema);
	
	var SessionSchema = mongoose.Schema({
		token: String,
		account_id: String
	});
	var Session = mongoose.model('Session', SessionSchema);
	
	var ContactSchema = mongoose.Schema({
		first_name: String,
		last_name: String,
		email: String
	});
	var Contact = mongoose.model('Contact', ContactSchema);
	
	/**
	 * ROUTE: Session
	 */
	app.post('/sign_in', function(req, res) {
		var body = req.body,
			email = body.email,
			password = body.password;
		
		console.log('Request body: ' + JSON.stringify(body));
		User.findOne({email: email, password: password}, function (err, user) {
			if (!err && user !== undefined) {
				var token = uuid.v4();
				
				var session = new Session({token: token, account_id: user.id});
				session.save(function (err) {
					if (!err) {
						console.log('Session created!');
						res.send({
							success: true,
							token: token,
							account_id: user.id
						});
					} else {
						console.log('Session not created!');
						res.send({
							success: false,
							message: 'Something wrong happened!'
						});
					}
				});

			} else {
				console.log('Wrong email/password!');
				res.send({
					success: false,
					message: 'Invalid email/password'
				});
			}
		});
		
	});
	
	app.post('/sign_out', function(req, res) {
		var body = req.body,
			token = body.token,
			account_id = body.account_id;

		return Session.findOne({token: token, account_id: account_id}, function (err, session) {
			if (!err && session !== undefined) {
				return session.remove(function (err) {
					if (!err) {
						console.log("Session deleted!");
						return res.send(200);
					} else {
						console.log('Error: Session not deleted: ' + err);
						console.log(err);
						return res.send(200);
					}
				});
			} else {
				console.log('Error: Session not found: ' + err);
				console.log(err);
				return res.send(200);
			}
		});
		
	});
	
	app.post('/sign_up', function(req, res) {
		var body = req.body,
			email = body.email,
			password = body.password;
		
		User.findOne({ email: email }, function(err, user) {
			if (!err) {
				if (user ===undefined) {
					
					var newUser = new User({ email: email, password: password });
					newUser.save(function(err) {
						if (!err) {
							console.log("User created!");
							res.send(user);
						} else {
							console.log('Error: User not created: ' + err);
							res.send(500, { error: 'Something wrong happened'});
						}
					});
					
				} else {
					console.log('User already signed up.');
					res.send(403, { error: 'This email is already registered!'});
				}
			} else {
				console.log('Error while looking for users: ' + err);
			}
		});
		
	});
	
	function validTokenProvided(req, res, callback) {
		var token = req.param('token'),
			account_id = req.param('account_id');

		Session.findOne({token: token, account_id: account_id}, function (err, session) {
			if (!err && session !== undefined) {
				console.log('Correct token!');
				callback(res);
//				return true;
			} else {
				console.log('Wrong token!');
				res.send(401, { error: 'Invalid token!'});
//				return false;
			}
		});
	}
	
	/**
	 * ROUTE: Contacts
	 */
	app.get('/contacts', function (req, res) {
		validTokenProvided(req, res, function(res) {
			Contact.find(function (err, contacts) {
				if (!err) {
					console.log('Found contacts: ' + JSON.stringify(contacts));
					res.send(contacts);
				} else {
					console.log('Error: Contacts not found: ' + err);
					res.send(500, 'Impossible to fetch the contacts.');
				}
			});
		});
	});
	
	app.post('/contacts', function (req, res) {
		validTokenProvided(req, res, function(res) {
			var contact = new Contact(req.body.todo);
			contact.save(function (err) {
				if (!err) {
					console.log("Contact created!");
					res.send(contact);
				} else {
					console.log('Error: Contact not created: ' + err);
					console.log(err);
					res.send(500, 'The contact was not created.');
				}
			});
		});
	});
	
	app.put('/contacts/:id', function (req, res) {
		validTokenProvided(req, res, function(res) {
			return Contact.findById(req.params.id, function (err, contact) {
				contact.first_name = req.body.contact.first_name;
				contact.last_name = req.body.contact.last_name;
				contact.email = req.body.contact.email;
				return contact.save(function (err) {
					if (!err) {
						console.log("Contact updated!");
						res.send(contact);
					} else {
						console.log('Error: Contact not updated: ' + err);
						console.log(err);
						res.send(500, 'The contact was not updated.');
					}
				});
			});
		});
	});
	
	app.delete('/contacts/:id', function (req, res) {
		validTokenProvided(req, res, function(res) {
			return Contact.findById(req.params.id, function (err, contact) {
				return contact.remove(function (err) {
					if (!err) {
						console.log("Contact deleted!");
						res.send(200);
					} else {
						console.log('Error: Contact not deleted: ' + err);
						console.log(err);
						res.send(500, 'The contact was not deleted.');
					}
				});
			});
		});
	});
	
});

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
