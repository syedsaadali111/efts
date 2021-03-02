var mongoose = require('mongoose');

const Public_Institute = mongoose.Schema({
        id: Number,
        name: String,
        context: String,
        rule_issuer: Boolean,
        description: String,
        email : String,
        phone: Number,
        address: String });

const PublicInstitute = mongoose.model('public_institutes', Public_Institute);
module.exports = PublicInstitute;
