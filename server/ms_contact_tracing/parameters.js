var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    factor_label: {
        type: String,
        required: true
    },
    multiplication_factor: {
        type: Number,
    },
    risk_levels: {
        type: [Number]
    },
    value: {
        type: Number
    }
});

module.exports = mongoose.model('risk_factor_params', userSchema);