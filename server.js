/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose');

/**
 * Set up the database conection
 */
mongoose.connect(process.env.MONGO_URL);

/**
 * Set up the server
 */
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser()); 
  app.use(express.session({ secret: 'Le chat est dans la boite.' }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/**
 * Set up the routes
 */

 app.get('/users/:id', function (req, res){
   return UserModel.findById(req.params.id, function (err, user) {
     if (!err) {
       console.log('Found user: ' + JSON.stringify(user));
       return res.send({user: user});
     } else {
       return console.log('Error: User not found: ' + err);
     }
   });
 });

 app.post('/users', function (req, res){
   return UserModel.findById(req.params.id, function (err, user) {
     user.first_name = req.body.first_name;
     user.last_name = req.body.last_name;
     return user.save(function (err) {
       if (!err) {
         console.log("User " + req.params.id + " updated");
       } else {
         console.log(err);
       }
       return res.send(user);
     });
   });
 });

 app.put('/users/:id', function (req, res){
   return UserModel.findById(req.params.id, function (err, user) {
     user.first_name = req.body.first_name;
     user.last_name = req.body.last_name;
     return user.save(function (err) {
       if (!err) {
         console.log("User " + req.params.id + " updated");
       } else {
         console.log(err);
       }
       return res.send(user);
     });
   });
 });

 app.delete('/users/:id', function (req, res){
   return UserModel.findById(req.params.id, function (err, user) {
     return user.remove(function (err) {
       if (!err) {
         console.log("User " + req.params.id + " removed");
         return res.send('');
       } else {
         console.log(err);
       }
     });
   });
 });

/**
 * Set up the Schema
 */
var Schema = mongoose.Schema;  

var UserSchema = new Schema({
  first_name: String,  
  last_name: String,
  email: String,
  contacts: [ContactSchema]
});

var ContactSchema = new Schema({
  first_name: String,
  last_name: String,
  email: String,
  mobile_phone: String,
  address: String,
  postcode: String,
  city: String,
  country: String
});

var UserModel = mongoose.model('User', UserSchema);  

/**
 * Run the server
 */
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
