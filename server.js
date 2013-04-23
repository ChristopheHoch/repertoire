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
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/**
 * Set up the routes
 */
// var users = require('./routes/users');

app.get('/api', function (req, res) {
  res.send('Sterfly API is running');
});

app.get('/users', function (req, res) {
  res.contentType('application/json');
  return UserModel.find(function (err, users) {
    if (!err) {
        console.log('Found users: ' + JSON.stringify(users));
        return res.send({users: users});
    } else {
      return console.log('Error: Users not found: ' + err);
    }
  });
});

app.post('/users', function (req, res){
  var user;
  console.log("POST: ");
  console.log(req.body);
  user = new UserModel({
    first_name: req.body.first_name,
    last_name: req.body.last_name
  });
  user.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(user);
});

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

app.put('/users/:id', function (req, res){
  return UserModel.findById(req.params.id, function (err, user) {
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    return user.save(function (err) {
      if (!err) {
        console.log("updated");
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
        console.log("removed");
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
    last_name: String
});

var UserModel = mongoose.model('User', UserSchema);  

/**
 * Run the server
 */
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});