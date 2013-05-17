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