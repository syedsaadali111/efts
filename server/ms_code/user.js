var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    TC: {
        type: String,
        required: true,
    },
    EFTScode: {
        type: String,
        required: true,
    },
    expirationDate: {
        type: Date,
        expires: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user', userSchema);