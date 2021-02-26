var mongoose = require('mongoose');

const citizenSchema = mongoose.Schema({
  TC: Number,
  FName: String,
  SName: String,
  DOB: String,
  Gender: String,
  Email: String,
  Occupation: String,
  Phone: Number
});

const Citizens = mongoose.model('citizens', citizenSchema);
module.exports = Citizens;

/*this is the Schema for MongoDB. The citizens written in the 
  second last line is the collection(table) in MongoDB.
*/