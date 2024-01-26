const mongoose = require('mongoose');

const Users = new mongoose.Schema({
    ID: String,
    consoleID: String,
    email: String,
    username: String,
    linkTime: String,
    linkDate: String
})

module.exports = mongoose.model('Users', Users);