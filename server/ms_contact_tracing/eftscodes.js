var mongoose = require('mongoose');

var Codes_EFTS = new mongoose.Schema({
    EFTScode: {
        type: String,
        required: true
    },
    qrcode_image : {
        type: String,
        required:true
    },
    expirationDate: {
        type: Date,
        expires: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

var userSchema = new mongoose.Schema({
    TC: {
        type: Number,
        required: true
    },
    Status: {
        type: Boolean,
        required: true,
        default : false
    },
    Codes : [Codes_EFTS]

});

module.exports = mongoose.model('eftscodes', userSchema);