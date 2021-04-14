var mongoose = require('mongoose');

const loginSchema = mongoose.Schema({
  username: String,
  password: String,
  type : {
    type : String,
    default : "other"
  }
});

const login_user = mongoose.model('adminlogins', loginSchema);
module.exports = login_user;