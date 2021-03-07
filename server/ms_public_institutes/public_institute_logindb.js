var mongoose = require('mongoose');

const login_inst = mongoose.Schema({
  id: Number,
  password: String});

const login_institute = mongoose.model('logins', login_inst);
module.exports = login_institute;
