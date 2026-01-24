const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
},
{
    strict: true // Enforce schema to prevent injection of unwanted fields
});

module.exports = mongoose.model('User', userSchema);