var mongoose = require('mongoose');

const login_inst = mongoose.Schema({
  email: String,
  password: String,
  active :{
    type : Boolean,
    default : false
  },
  approved : {
    type : Boolean,
    default : false
  }
});

const login_institute = mongoose.model('logins', login_inst);
module.exports = login_institute;
