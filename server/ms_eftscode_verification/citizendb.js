var mongoose = require('mongoose');

const citizenSchema = mongoose.Schema({
  TC: Number,
  FName: String,
  SName: String,
  DOB: String,
  Gender: String,
});

const Citizens = mongoose.model('citizens', citizenSchema);
module.exports = Citizens;