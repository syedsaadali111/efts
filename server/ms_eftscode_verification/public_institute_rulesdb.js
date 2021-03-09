var mongoose = require('mongoose');

const rules = mongoose.Schema({
    id: Number,
    p_id : String,
    name: String,
    description: String,
    context : String,
    startDate: String,
    endDate: String,
    days: [Number],
    priority: Number,
    timeFrom : String,
    timeTo: String,
    minAge :Number,
    maxAge : Number,
    travelFrom : [String],
    travelTo: [String],
    occupationDeny : [String],
    ruleActive : Boolean
    });

const p_institute_rule = mongoose.model('public_institutes_rules', rules);
module.exports = p_institute_rule;