var mongoose = require('mongoose');

const codeSchema = mongoose.Schema({
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
    Status : {
        type : Boolean,
        required : true,
        default : false
    },
    Codes : [codeSchema]
});

module.exports = mongoose.model('EFTScodes', userSchema);