const mongoose = require('mongoose');
const User = mongoose.model('User', {
    name: String,
    email: String,
    cargo: String,
    telefone: String,
    password: String
})

module.exports = User;