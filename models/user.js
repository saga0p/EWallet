const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username cannot be empty']
    },
    password: {
        type: String,
        required: [true, 'password cannot be empty']
    },
    coins: 
    {type: Number,
        default: 0
    },
    credits: {type: Number,
    default: 0},
    referralcode: {
        type: String,
        default: null
    }
})

module.exports = mongoose.model('User', userSchema);