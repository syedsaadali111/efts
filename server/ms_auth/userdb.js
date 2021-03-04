var mongoose = require('mongoose');

const loginSchema = mongoose.Schema({
  id: Number,
  password: String});

const login_user = mongoose.model('users', loginSchema);
module.exports = login_user;

/*this is the Schema for MongoDB. The citizens written in the 
  second last line is the collection(table) in MongoDB.
*/