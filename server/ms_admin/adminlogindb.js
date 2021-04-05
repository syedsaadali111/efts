var mongoose = require('mongoose');

const loginSchema = mongoose.Schema({
  username: String,
  password: String,
  type : String 
});

const login_user = mongoose.model('adminlogins', loginSchema);
module.exports = login_user;