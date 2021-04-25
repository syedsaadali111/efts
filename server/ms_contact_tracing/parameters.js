var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    factor_label: {
        type: String,
        required: true
    },
    multiplication_factor: {
        type: Number,
        required: true
    },
    risk_levels: {
        type: [Number]
    }
});

module.exports = mongoose.model('risk_factor_params', userSchema);